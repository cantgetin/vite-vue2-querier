const { Pool } = require('pg')
//const connectionString = 'postgresql://postgres:postgres@10.0.23.118:5432/tezis'
const connectionString = 'postgres://postgres:1488q1337@localhost:5432/testdb';
var pool = new Pool({connectionString});


const outEcp = (request, response) => {
  let from = request.query.dateValueFrom
  let to = request.query.dateValueTo
  // console.log(request.query)
    pool.query(
      outEcpQuery, [from, to], (error, results) => {
       if (error) {
         throw error
       }
       response.status(200).json(results.rows)
     })
   }
const orgTypeNumber = (request, response) => {
      pool.query(
        orgTypeCount, (error, results) => {
         if (error) {
           throw error
         }
         response.status(200).json(results.rows)
       })
     }

const orgTypes = (request, response) => {
        pool.query(
          orgType, (error, results) => {
           if (error) {
             throw error
           }
           response.status(200).json(results.rows)
         })
       }

const solutionsCoef = (request, response) => {
        pool.query(
          solutionsCoefQuery, (error, results) => {
            if (error) {
              throw error
            }
            response.status(200).json(results.rows)
          })
        }
        

module.exports = {
  outEcp,
  orgTypeNumber,
  orgTypes,
  solutionsCoef
}

const solutionsCoefQuery = `
SELECT 
coalesce(t1.executor_id,t2.executor_id) as executor_id,
coalesce(t1.coefficient,t2."coef") as coefficient, 
t1."goodSolutionsCount" as goodSolutionsCount, 
array_agg(t2."badSolutionsCount") as badSolutionNumbers, 
array_agg(t2."daysOverdue") as badSolutionDaysOverdue,
0 as KID

FROM (
SELECT 
executor_id,
coefficient,
COUNT(executor_id) as "goodSolutionsCount"
FROM TM_TASK
WHERE
DATE_PART('day', finish_date_fact::date) - 
DATE_PART('day', finish_datetime_plan::date) < 0
and
date_trunc('month', start_datetime_fact)> date_trunc('month', current_date - interval '5 month')
 
GROUP BY executor_id, coefficient
ORDER BY executor_id) t1
FULL JOIN 
(
SELECT 
executor_id,
coefficient as coef,
CAST (COUNT(executor_id) as SMALLINT) as "badSolutionsCount", 
CAST (DATE_PART('day', coalesce(finish_date_fact, NOW())::date) - 
DATE_PART('day', finish_datetime_plan::date)  as SMALLINT)
as "daysOverdue"
FROM TM_TASK
WHERE
DATE_PART('day', coalesce(finish_date_fact, NOW())::date) - 
DATE_PART('day', finish_datetime_plan::date) > 0 
and
date_trunc('month', start_datetime_fact)> date_trunc('month', current_date - interval '5 month')

GROUP BY executor_id, coef,  "daysOverdue"
ORDER BY executor_id) t2
ON t1.executor_id = t2.executor_id and t1.coefficient = t2."coef"
GROUP BY t1.executor_id,t2.executor_id, t1.coefficient, t2."coef", t1."goodSolutionsCount"
ORDER BY coalesce(t1.executor_id,t2.executor_id)
`



const outEcpQuery = `
SELECT DISTINCT o.name AS org_name,
COALESCE(allinbox.icount, 0) AS inbox,
COALESCE(alloutbox.ocount,0) AS outbox,
COALESCE(ecpboiv.ecpboivcount,0) AS ecpoutbox


FROM
(SELECT org.name
FROM df_organization org
ORDER BY org.name) AS o 

LEFT JOIN
(SELECT org.name AS NAME, COUNT(DISTINCT doc.number_) AS ocount
from df_doc_office_data ofdata 
JOIN df_doc doc ON ofdata.doc_id = doc.card_id
JOIN df_simple_doc sdoc ON doc.card_id = sdoc.card_id
LEFT JOIN wf_attachment wfa ON doc.card_id = wfa.card_id
JOIN df_organization org ON doc.organization_id = org.id
WHERE doc.doc_office_doc_kind = 'O'
AND doc.reg_date >= $1
and doc.reg_date <= $2
AND ofdata.deleted_by is NULL
GROUP BY org.name) AS alloutbox 
on alloutbox.name = o.name

LEFT JOIN

(select org.name as name, COUNT(DISTINCT doc.number_) as icount
from df_doc_office_data ofdata 
JOIN df_doc doc on ofdata.doc_id = doc.card_id
JOIN df_simple_doc sdoc on doc.card_id = sdoc.card_id
JOIN wf_attachment wfa on doc.card_id = wfa.card_id
JOIN df_organization org on doc.organization_id = org.id
where doc.doc_office_doc_kind = 'I'
AND doc.reg_date >= $1
and doc.reg_date <= $2
GROUP BY org.name) as allinbox 
on o.name = allinbox.name

LEFT JOIN

(SELECT org.name AS NAME, COUNT(DISTINCT doc.number_) AS ecpboivcount
FROM df_doc_office_data ofdata 
JOIN df_doc doc ON ofdata.doc_id = doc.card_id
JOIN wf_attachment wfa ON doc.card_id = wfa.card_id
JOIN df_organization org ON doc.organization_id = org.id
WHERE doc.reg_date >= $1
and doc.reg_date <= $2
AND doc.doc_office_doc_kind = 'O' 
AND wfa.signatures IS NOT NULL
AND ofdata.deleted_by is NULL
GROUP BY org.name) AS ecpboiv

ON o.name = ecpboiv.name

GROUP BY org_name,
inbox,
outbox, 
ecpoutbox

ORDER BY outbox DESC
` 

const orgTypeCount = `
SELECT dfo.organization_type_id,
CASE WHEN dfo.organization_type_id = '4e7ae7f9-63a1-458d-8a2b-31555897cb9d' THEN 'ОИВ'
WHEN dfo.organization_type_id = '29df8958-5d16-44e9-804c-94f92585a801' THEN 'ФОИВ'
WHEN dfo.organization_type_id = 'c6fefae3-6c60-4855-9d89-e5bf2ae7c33e' THEN 'ОМСУ'
WHEN dfo.organization_type_id = '381322a8-7e19-4fb1-9720-170c7f6b9c0d' THEN 'Правительство'
WHEN dfo.organization_type_id = 'd6d0fda0-e030-0b8c-b8c3-5fb0ca81510d' THEN 'Подвед ОИВ'
WHEN dfo.organization_type_id = '85dac2ec-1302-5823-dec2-3e0dd6910351' THEN 'Подвед ОМСУ'
WHEN dfo.organization_type_id  IS NULL THEN 'Другое'
END,

COUNT(*)

FROM df_organization dfo 

GROUP BY dfo.organization_type_id
`

const orgType = `
SELECT dfo.name,
CASE WHEN dfo.organization_type_id = '4e7ae7f9-63a1-458d-8a2b-31555897cb9d' THEN 'ОИВ'
WHEN dfo.organization_type_id = '29df8958-5d16-44e9-804c-94f92585a801' THEN 'ФОИВ'
WHEN dfo.organization_type_id = 'c6fefae3-6c60-4855-9d89-e5bf2ae7c33e' THEN 'ОМСУ'
WHEN dfo.organization_type_id = '381322a8-7e19-4fb1-9720-170c7f6b9c0d' THEN 'Правительство'
WHEN dfo.organization_type_id = 'd6d0fda0-e030-0b8c-b8c3-5fb0ca81510d' THEN 'Подвед ОИВ'
WHEN dfo.organization_type_id = '85dac2ec-1302-5823-dec2-3e0dd6910351' THEN 'Подвед ОМСУ'
END
FROM df_organization dfo 

GROUP BY dfo.name, dfo.organization_type_id
`