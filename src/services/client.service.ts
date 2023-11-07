import db from '../db';

export class ClientService {

    async getAllUsers(page = 1, limit = 10, search = "") {
        try {

            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH ClientOrders AS (
                 SELECT
                     c.clientId as client_id,
                     c.fio as client_fio,
                     c.isMember as client_ismember,
                     c.dob as client_dob,
                     c.phone as client_phone,
                     MAX(o.createdat) AS last_order_date,
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
                    client_id,
                    client_fio,
                    client_ismember,
                    client_dob,
                    client_phone,
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
                        MAX(o.createdat) AS last_order_date,
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

    async getOne(id: number) {
        try {

            
           const [[result], _] = await db.query(`
           SELECT 
                Clients.clientId as client_id,
                Clients.fio as client_fio,
                Clients.phone as client_phone,
                Clients.dob as client_dob,
                Clients.isMember as client_ismember,
                Abonements.abonementId as abonement_id,
                Abonements.title as abonement_title,
                Abonements.description as abonement_description,
                Abonements.price as abonement_price,
                Abonements.duration as abonement_duration,
                Mentors.mentorId as mentor_id,
                Mentors.fio AS mentor_name,
                Purchases.startDate as purchase_startdate,
                Purchases.endDate as purchase_enddate,
                Purchases.paymentMethod as purchase_paymentmethod,
                Purchases.isPaid as purchase_ispaid,
                Purchases.abonementid as purchase_abonement_id
            FROM 
                Clients
            LEFT JOIN
                Purchases ON Clients.clientId = Purchases.clientId
            LEFT JOIN
                Abonements ON Purchases.abonementId = Abonements.abonementId
            LEFT JOIN
                Mentors ON Clients.mentorId = Mentors.mentorId
            WHERE
                Clients.clientId = ${id};
           `);
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching client'
        }
    }
  
}
