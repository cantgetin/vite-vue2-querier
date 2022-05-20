const { Pool } = require("pg");
const connectionString =
  "postgresql://postgres:postgres@10.0.23.118:5432/tezis";
var pool = new Pool({ connectionString });

const outEcp = (request, response) => {
  let from = request.query.dateValueFrom;
  let to = request.query.dateValueTo;
  // console.log(request.query)
  pool.query(outEcpQuery, [from, to], (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};
const orgTypeNumber = (request, response) => {
  pool.query(orgTypeCount, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const orgTypes = (request, response) => {
  pool.query(orgType, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const solutionsCoef = (request, response) => {
  pool.query(solutionsCoefQuery, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const solutionsFinalCoef = (request, response) => {
  pool.query(finalKid, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

module.exports = {
  outEcp,
  orgTypeNumber,
  orgTypes,
  solutionsCoef,
  solutionsFinalCoef,
};

const finalKid = `

SELECT name, sum(kidf.quantity) AS quantity, sum(kidf.good) AS good,sum(kidf.bad) AS bad,  sum(kidf.unfinished) AS unfinished
FROM
(SELECT temp.name, sum(temp.quantity) AS quantity, temp.coefficient, SUM(temp.good) as good, SUM(TEMP.bad) AS bad, jsonb_agg(temp."bad/daysoverdue") filter (where temp."bad/daysoverdue" is not null) as "bad/daysoverdue", sum(temp.unfinished) AS unfinished
FROM
(SELECT
	su.name,
	COUNT(tt.card_id) quantity,
	
	(CASE
		WHEN gtk.name = 'Главный федеральный инспектор в Челябинской области' THEN 1
		WHEN gtk.name = 'Запрос Депутата Государственной Думы' THEN 1
		WHEN gtk.name = 'Министерства и др.' THEN 1
		WHEN gtk.name = 'Полномочный представитель Президента РФ в УрФО' THEN 2
		WHEN gtk.name = 'Аппарат Правительства РФ' THEN 3
		WHEN gtk.name = 'Администрация Президента РФ' THEN 3
		WHEN gtk.name = 'Поручения Президента РФ' THEN 3
		WHEN gtk.name = 'Председатель Правительства РФ' THEN 3
		WHEN gtk.name = 'Проверки УрФО' THEN 1
		WHEN gtk.name = 'Протоколы УрФО' THEN 1
		WHEN gtk.name = 'Указы Президента РФ' THEN 3
    WHEN gtk.name = 'Поручения Губернатора' THEN 1
		WHEN gtk.name = 'Поручения Губернатора с коэфф. 3' THEN 3
		WHEN gtk.name IS NULL THEN 1
	END) coefficient,

(SUM (CASE WHEN (CAST (DATE_PART('day', COALESCE(finish_datetime_fact, NOW())) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) < 0 THEN 1 END)) good,
(SUM (CASE WHEN (CAST (DATE_PART('day', finish_datetime_fact) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) > 0 THEN 1 END)) bad,

(CASE WHEN (SUM (CASE WHEN (CAST (DATE_PART('day', finish_datetime_fact) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) > 0 THEN 1 END)) IS NOT NULL THEN 
CONCAT_WS('/',(SUM (CASE WHEN (CAST (DATE_PART('day', finish_datetime_fact) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) > 0 THEN 1 END)), 
(CAST (DATE_PART('day', COALESCE(finish_datetime_fact, NOW())::date) - DATE_PART('day', finish_datetime_plan::date)  as SMALLINT))) END) as "bad/daysoverdue",

(SUM (CASE WHEN (DATE_PART('day', NOW()) > DATE_PART('day', finish_datetime_plan::date)) AND finish_datetime_fact IS NULL THEN 1  END)) unfinished

FROM tm_task tt

LEFT JOIN gov74_task_kind gtk ON gtk.id = tt.task_kind
LEFT JOIN sec_user su ON su.id = tt.executor_id 
JOIN df_employee de ON de.user_id = su.id 
JOIN df_position dp ON dp.id = de.position_id
WHERE dp.name LIKE '%Губернатора%'
and create_date >= '2022-01-01' AND create_date <= '2022-05-30'
GROUP BY su.name, gtk.name, tt.finish_datetime_plan, tt.finish_datetime_fact

ORDER BY su.name, coefficient asc) temp
GROUP BY name, coefficient
ORDER BY name) AS kidf

GROUP BY kidf.name

`;

const solutionsCoefQuery = `
SELECT temp.name, sum(temp.quantity), temp.coefficient, SUM(temp.good) as good, SUM(temp.good) as good, jsonb_agg(temp."bad/daysoverdue") filter (where temp."bad/daysoverdue" is not null) as "bad/daysoverdue", sum(temp.unfinished) AS unfinished
FROM
(SELECT
	su.name,
	COUNT(tt.card_id) quantity,
	
	(CASE
		WHEN gtk.name = 'Главный федеральный инспектор в Челябинской области' THEN 1
		WHEN gtk.name = 'Запрос Депутата Государственной Думы' THEN 1
		WHEN gtk.name = 'Министерства и др.' THEN 1
		WHEN gtk.name = 'Полномочный представитель Президента РФ в УрФО' THEN 2
		WHEN gtk.name = 'Аппарат Правительства РФ' THEN 3
		WHEN gtk.name = 'Администрация Президента РФ' THEN 3
		WHEN gtk.name = 'Поручения Президента РФ' THEN 3
    WHEN gtk.name = 'Поручения Губернатора' THEN 1
		WHEN gtk.name = 'Председатель Правительства РФ' THEN 3
		WHEN gtk.name = 'Проверки УрФО' THEN 1
		WHEN gtk.name = 'Протоколы УрФО' THEN 1
		WHEN gtk.name = 'Указы Президента РФ' THEN 3
		WHEN gtk.name = 'Поручения Губернатора с коэфф. 3' THEN 3
		WHEN gtk.name IS NULL THEN 1
	END) coefficient,

(SUM (CASE WHEN (CAST (DATE_PART('day', COALESCE(finish_datetime_fact, NOW())) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) < 0 THEN 1 END)) good,

(CASE WHEN (SUM (CASE WHEN (CAST (DATE_PART('day', finish_datetime_fact) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) > 0 THEN 1 END)) IS NOT NULL THEN 
CONCAT_WS('/',(SUM (CASE WHEN (CAST (DATE_PART('day', finish_datetime_fact) - DATE_PART('day', finish_datetime_plan::DATE)AS INT)) > 0 THEN 1 END)), 
(CAST (DATE_PART('day', COALESCE(finish_datetime_fact, NOW())::date) - DATE_PART('day', finish_datetime_plan::date)  as SMALLINT))) END) as "bad/daysoverdue",

(SUM (CASE WHEN (DATE_PART('day', NOW()) > DATE_PART('day', finish_datetime_plan::date)) AND finish_datetime_fact IS NULL THEN 1  END)) unfinished

FROM tm_task tt

LEFT JOIN gov74_task_kind gtk ON gtk.id = tt.task_kind
LEFT JOIN sec_user su ON su.id = tt.executor_id 
JOIN df_employee de ON de.user_id = su.id 
JOIN df_position dp ON dp.id = de.position_id
WHERE dp.name LIKE '%Губернатора%'
and create_date >= '2022-01-01' AND create_date <= '2022-05-30'
GROUP BY su.name, gtk.name, tt.finish_datetime_plan, tt.finish_datetime_fact


ORDER BY su.name, coefficient asc) temp
GROUP BY name, coefficient
ORDER BY name
`;

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
`;

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
`;

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
`;
