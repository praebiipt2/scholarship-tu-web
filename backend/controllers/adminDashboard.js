import pool from "../pool.js";

let connection = await pool.getConnection();

export const getAdminDashboard = async (req, res) => {
  try {
    /* จำนวนทุนทั้งหมด */
    const [[{ total_scholarship }]] = await connection.execute(`
      SELECT COUNT(*) AS total_scholarship
      FROM scholarship_info
    `);

    /* จำนวนแต่ละประเภททุน */
    const [typeCount] = await connection.execute(`
      SELECT scho_type, COUNT(*) AS total
      FROM scholarship_info
      GROUP BY scho_type
    `);

    /* จำนวนทุนตามแหล่งที่มา */
    const [sourceCount] = await connection.execute(`
      SELECT scho_source, COUNT(*) AS total
      FROM scholarship_info
      GROUP BY scho_source
    `);

    /* จำนวนนศที่สมัครทุน */
    const [[{ total_enroll }]] = await connection.execute(`
      SELECT COUNT(*) AS total_enroll FROM enroll
    `);

    /* จำนวนนศทั้งหมด */
    const [[{ total_students }]] = await connection.execute(`
      SELECT COUNT(*) AS total_students FROM student
    `);

    /* จำนวนนศทีไม่เคยได้รับทุน */
    const [[{ no_scholarship }]] = await connection.execute(`
      SELECT COUNT(*) AS no_scholarship
      FROM student s
      LEFT JOIN enroll e 
        ON s.std_id = e.std_id 
        AND e.enroll_status = 1
      WHERE e.enroll_id IS NULL
    `);

    /* จำนวนนศในแต่ละชั้นปี */
    const [studentByYear] = await connection.execute(`
    SELECT std_year, COUNT(*) AS total
    FROM student
    GROUP BY std_year
    ORDER BY std_year
    `)


    /* จำนวนสมัครทุนในแต่ละปี */
    const [enrollByYear] = await connection.execute(`
    SELECT s.scho_year, COUNT(*) AS total
    FROM enroll e
    JOIN scholarship_info s ON e.scho_id = s.scholarship_id
    GROUP BY s.scho_year
    ORDER BY s.scho_year
    `);


    /* bookmark */
    const [bookmarkStats] = await pool.execute(`
    SELECT
        s.scholarship_id AS scho_id,
        s.scho_name,
        COUNT(b.scho_id) AS total
    FROM scholarship_info s
    LEFT JOIN bookmark b ON s.scholarship_id = b.scho_id
    GROUP BY s.scholarship_id, s.scho_name
    ORDER BY total DESC
    LIMIT 10
`);


    return res.json({
      total_scholarship,
      typeCount,
      sourceCount,
      total_enroll,
      total_students,
      no_scholarship,
      enrollByYear,
      studentByYear,
      bookmarkStats
    });
    

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Dashboard error" });
  } finally {
    connection.release()
  }

}