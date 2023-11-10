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
                 WHERE title LIKE '%${search}%'  
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
                    WHERE title LIKE '%${search}%'  
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

            
           await db.query(`
                 SELECT
                    abonementId as abonement_id,
                    title as abonement_title,
                    description as abonement_description,
                    price as abonement_price,
                    duration as abonement_duration
                 FROM Abonements
                 WHERE abonementId = ${id}'  
           `);
           
           return true
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching abonement'
        }
    }
  
}
