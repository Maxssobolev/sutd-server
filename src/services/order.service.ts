import db from '../db';

export class OrderService {

    async getAllOrders(page = 1, limit = 10, search = "") {
        try {

            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH Orders AS (
                 SELECT
                     o.clientId as id,
                     o.orderId AS orderid,
                     o.mentorId AS mentorid,
                     o.notes,
                     o.status,
                     o.createdat,
                     m.fio AS mentor_name,
                     c.fio AS client_name
                 FROM Orders o
                 LEFT JOIN Clients c ON o.clientId = c.clientId
                 LEFT JOIN Mentors m ON o.mentorId = m.mentorId
                 WHERE c.fio LIKE '%${search}%'  
                 )
                 SELECT
                    id,
                    orderid,
                    mentorid,
                    notes,
                    status,
                    createdat,
                    mentor_name,
                    client_name
                 FROM (
                     SELECT
                         *,
                         ROW_NUMBER() OVER (ORDER BY createdat DESC) AS row_num
                     FROM Orders
                 ) AS PaginatedData
                 WHERE row_num BETWEEN ${page} * ${limit} + 1 AND (${page} + 1) * ${limit}
                `),
                db.query(`
                WITH Orders AS (
                    SELECT
                        o.clientId as id,
                        o.orderId AS orderid,
                        o.mentorId AS mentorid,
                        o.notes,
                        o.status,
                        o.createdat,
                        m.fio AS mentor_name,
                        c.fio AS client_name
                    FROM Orders o
                    LEFT JOIN Clients c ON o.clientId = c.clientId
                    LEFT JOIN Mentors m ON o.mentorId = m.mentorId
                    WHERE c.fio LIKE '%${search}%'
                    
                )
                SELECT COUNT(*) AS total_count
                FROM Orders;
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
