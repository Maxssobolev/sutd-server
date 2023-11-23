import { AbonementUpdateDto } from '../shared/types';
import db from '../db';

export class AbonementService {

    async getAll(page = 1, limit = 10, search = "", order: any) {
        const myOrder = JSON.parse(order)
        const hasOrder = !!myOrder && myOrder?.sortModel?.at(0)
        try {

            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH Abonements AS (
                 SELECT
                    abonementId as abonement_id,
                    title as abonement_title,
                    description as abonement_description,
                    price as abonement_price,
                    duration as abonement_duration
                 FROM Abonements
                 WHERE title ILIKE '%${search}%'  
                 )
                 SELECT
                    abonement_id,
                    abonement_title,
                    abonement_description,
                    abonement_price,
                    abonement_duration
                 FROM (
                     SELECT
                         *,
                         ROW_NUMBER() OVER (ORDER BY ${hasOrder ? `${myOrder.sortModel?.at(0).field} ${myOrder.sortModel?.at(0).sort}` : 'abonement_id DESC'}) AS row_num
                     FROM Abonements
                 ) AS PaginatedData
                 WHERE row_num BETWEEN ${page} * ${limit} + 1 AND (${page} + 1) * ${limit}
                `),
                db.query(`
                WITH Abonements AS (
                    SELECT
                     abonementId as abonement_id,
                     title as abonement_title
                    FROM Abonements
                    WHERE title ILIKE '%${search}%'  
                )
                SELECT COUNT(*) AS total_count
                FROM Abonements;
               `)
            ])

            const result = { rows, count: Number((count as {total_count: string}).total_count) }
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching abonements'
        }
    }

    async getOne(id: number) {
        try {

            
            const [[result], _] = await db.query(`
                 SELECT
                    abonementId as abonement_id,
                    title as abonement_title,
                    description as abonement_description,
                    price as abonement_price,
                    duration as abonement_duration
                 FROM Abonements
                 WHERE abonementId = ${id};  
           `);
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching abonement'
        }
    }

    async update (dto: AbonementUpdateDto) {
        try {
            const sql = `
                UPDATE Abonements
                SET
                title = '${dto.abonement_title}',
                description = '${dto.abonement_description}',
                price = ${dto.abonement_price},
                duration = ${dto.abonement_duration}
                WHERE 
                abonementid = ${dto.abonement_id};
            `
                
            const [[result], _] = await db.query(sql);

            return result;
        }
        catch (e) {
            console.log(e)
            throw 'Error update order info'
        }
    }

    async create (dto: AbonementUpdateDto) {
        try {
            const sql = `
            INSERT INTO Abonements (abonementid, title, description, price, duration)
            VALUES (COALESCE((SELECT MAX(abonementid) FROM Abonements), 0) + 1, '${dto.abonement_title}', '${dto.abonement_description}', ${dto.abonement_price}, ${dto.abonement_duration});
            `
            const [[result], _] = await db.query(sql);

            return result;
        }
        catch (e) {
            console.log(e)
            throw 'Error create client'
        }
    }

    async delete (id: number) {
        const sql1 = `DELETE FROM Purchases WHERE abonementid = ${id};`
        const sql2 = `DELETE FROM Abonements WHERE abonementid = ${id};`
        const [[result], _] = await db.query(sql1 + sql2);

        return result
    }

    async stats () {
        const sql = `
        SELECT
            A.title AS abonement_title,
            COUNT(P.purchaseId) AS abonement_quantity,
            SUM(A.price) AS abonement_totalprice
        FROM
            Abonements A
        JOIN
            Purchases P ON A.abonementid = P.abonementid
        WHERE
            P.ispaid = true
        GROUP BY
            A.title;
        `
        const [result, _] = await db.query(sql);

        return result
    }
  
}
