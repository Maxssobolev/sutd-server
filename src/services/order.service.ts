import db from '../db';

export class OrderService {

    async getAllOrders(page = 1, limit = 10, search = "") {
        try {

            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH Orders AS (
                 SELECT
                     o.clientid as order_client_id,
                     o.orderid AS order_id,
                     o.mentorid AS order_mentor_id,
                     o.notes AS order_notes,
                     o.status as order_status,
                     o.createdat as order_createdat,
                     m.fio AS mentor_name,
                     c.fio AS client_fio,
                     c.clientid AS client_id
                 FROM Orders o
                 LEFT JOIN Clients c ON o.clientid = c.clientid
                 LEFT JOIN Mentors m ON o.mentorid = m.mentorid
                 WHERE c.fio LIKE '%${search}%'  
                 )
                 SELECT
                 order_client_id,
                 order_id,
                 order_mentor_id,
                 order_notes,
                 order_status,
                 order_createdat,
                 mentor_name,
                 client_fio,
                 client_id
                 FROM (
                     SELECT
                         *,
                         ROW_NUMBER() OVER (ORDER BY order_createdat DESC) AS row_num
                     FROM Orders
                 ) AS PaginatedData
                 WHERE row_num BETWEEN ${page} * ${limit} + 1 AND (${page} + 1) * ${limit}
                `),
                db.query(`
                WITH Orders AS (
                    SELECT
                        o.clientid as id,
                        o.orderid AS orderid,
                        o.mentorid AS mentorid,
                        o.notes,
                        o.status,
                        o.createdat,
                        m.fio AS mentor_name,
                        c.fio AS client_fio
                    FROM Orders o
                    LEFT JOIN Clients c ON o.clientid = c.clientid
                    LEFT JOIN Mentors m ON o.mentorid = m.mentorid
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
            throw 'Error fetching orders'
        }
    }
  
}
