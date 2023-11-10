import db from '../db';

export class MentorService {

    async getAllMentors(page = 1, limit = 10, search = "", order: any) {
        const myOrder = JSON.parse(order)
        const hasOrder = !!myOrder && myOrder?.sortModel?.at(0)
    
        try {

            const [[rows], [[count]]] = await Promise.all([
                db.query(`
                WITH Mentors AS (
                 SELECT
                     fio as mentor_name,
                     mentorid as mentor_id
                 FROM Mentors
                 WHERE fio ILIKE '%${search}%'  
                 )
                 SELECT
                    mentor_name,
                    mentor_id
                 FROM (
                     SELECT
                         *,
                         ROW_NUMBER() OVER (ORDER BY ${hasOrder ? `${myOrder.sortModel?.at(0).field} ${myOrder.sortModel?.at(0).sort}` : 'mentor_id DESC'}) AS row_num
                     FROM Mentors
                 ) AS PaginatedData
                 WHERE row_num BETWEEN ${page} * ${limit} + 1 AND (${page} + 1) * ${limit}
                `),
                db.query(`
                WITH Mentors AS (
                    SELECT
                     fio as mentor_name,
                     mentorid as mentor_id
                    FROM Mentors
                    WHERE fio ILIKE '%${search}%'  
                )
                SELECT COUNT(*) AS total_count
                FROM Mentors;
               `)
            ])

            const result = { rows, count: Number((count as {total_count: string}).total_count) }
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching mentors'
        }
    }

    async getOne(id: number) {
        try {

            
           const [[result], _] = await db.query(`
                 SELECT
                     fio as mentor_name,
                     mentorid as mentor_id
                 FROM Mentors
                 WHERE mentorid = ${id}'  
           `);
           
           return result
        }
        catch (e) {
            console.log(e)
            throw 'Error fetching mentor'
        }
    }
  
}
