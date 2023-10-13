import db from '../db';
export class ClientService {

    async getAllUsers(page = 1, limit = 10, search = "") {
        try {
            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH ClientOrders AS (
                 SELECT
                     c.clientId as id,
                     c.fio AS fio,
                     c.dob,
                     c.phone,
                     MAX(o."createdAt") AS last_order_date,
                     CASE
                         WHEN p.abonementId IS NOT NULL THEN 'Есть абонемент'
                         ELSE 'Нет абонемента'
                     END AS abonement_status,
                     m.fio AS mentor_name
                 FROM Clients c
                 LEFT JOIN Orders o ON c.clientId = o.clientId
                 LEFT JOIN Purchases p ON c.clientId = p.clientId
                 LEFT JOIN Mentors m ON c.mentorId = m.mentorId
                 WHERE c.fio LIKE '%${search}%'  
                 GROUP BY c.clientId, c.fio, m.fio, p.abonementId, c.dob, c.phone
                 )
                 SELECT
                     id,
                     fio,
                     dob,
                     phone,
                     last_order_date,
                     abonement_status,
                     mentor_name
                 FROM (
                     SELECT
                         *,
                         ROW_NUMBER() OVER (ORDER BY last_order_date DESC) AS row_num
                     FROM ClientOrders
                 ) AS PaginatedData
                 WHERE row_num BETWEEN ${page} * ${limit} + 1 AND (${page} + 1) * ${limit}
                `),
                db.query(`
                WITH ClientOrders AS (
                    SELECT
                        c.clientId,
                        c.fio AS client_name,
                        MAX(o."createdAt") AS last_order_date,
                        CASE
                            WHEN p.abonementId IS NOT NULL THEN 'Есть абонемент'
                            ELSE 'Нет абонемента'
                        END AS abonement_status,
                        m.fio AS mentor_name
                    FROM Clients c
                    LEFT JOIN Orders o ON c.clientId = o.clientId
                    LEFT JOIN Purchases p ON c.clientId = p.clientId
                    LEFT JOIN Mentors m ON c.mentorId = m.mentorId
                    WHERE c.fio LIKE '%${search}%'
                    GROUP BY c.clientId, c.fio, m.fio, p.abonementId
                )
                SELECT COUNT(*) AS total_count
                FROM ClientOrders;
               `)
            ])

            const result = { rows, count: Number((count as {total_count: string}).total_count) }
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching clients'
        }
    }
  
}
