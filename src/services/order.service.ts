import { OrderUpdateDto } from '../shared/types';
import db from '../db';

export class OrderService {

    async getAllOrders(page = 1, limit = 10, search = "", order: any) {
        const myOrder = JSON.parse(order)
        const hasOrder = !!myOrder && myOrder?.sortModel?.at(0)
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
                 WHERE c.fio ILIKE '%${search}%'  
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
                         ROW_NUMBER() OVER (ORDER BY ${hasOrder ? `${myOrder.sortModel?.at(0).field} ${myOrder.sortModel?.at(0).sort}` : 'order_createdat DESC'}) AS row_num
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
                    WHERE c.fio ILIKE '%${search}%'
                    
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
                Purchases.abonementid as purchase_abonement_id,
                Orders.clientid as order_client_id,
                Orders.orderid AS order_id,
                Orders.mentorid AS order_mentor_id,
                Orders.notes AS order_notes,
                Orders.status as order_status,
                Orders.createdat as order_createdat
            FROM 
                Orders
            LEFT JOIN
                Clients ON Clients.clientid = Orders.clientid
            LEFT JOIN
                Purchases ON Clients.clientid = Purchases.clientid
            LEFT JOIN
                Abonements ON Purchases.abonementid = Abonements.abonementid
            LEFT JOIN
                Mentors ON Clients.mentorid = Mentors.mentorid
            WHERE
                Orders.orderid = ${id};
           `);
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching order'
        }
    }

    async update (dto: OrderUpdateDto) {
        try {
            const sql = `
                UPDATE Orders
                SET
                mentorid = '${dto.order_mentor_id}',
                notes = '${dto.order_notes}',
                status = '${dto.order_status}',
                createdat = '${dto.order_createdat}'
                WHERE 
                orderid = ${dto.order_id};
            `
            const sql2 = (dto.abonement_id) ? `
                UPDATE Purchases
                SET
                abonementid = ${dto.abonement_id},
                paymentmethod = '${dto.purchase_paymentmethod}',
                ispaid = ${dto.purchase_ispaid},
                startdate = '${dto.purchase_startdate}',
                enddate = '${dto.purchase_enddate}'
                WHERE clientid = ${dto.client_id};
            ` : ''

            const [[result], _] = await db.query(sql + sql2);

            return result;
        }
        catch (e) {
            console.log(e)
            throw 'Error update order info'
        }
    }
  
}
