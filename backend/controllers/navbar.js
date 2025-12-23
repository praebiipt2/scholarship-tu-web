import pool from "../pool.js"

let connection = await pool.getConnection();

const navbar = async (req, res) => {
     const userId = req.user.user_id; 

    try{

    const [[user]] = await connection.execute(
      "SELECT user_id, role, email FROM users WHERE user_id = ?",
      [userId]
    );

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let profile = null;

    if (user.role === "admin") {
      const [[adm]] = await connection.execute(
        "SELECT adm_name, adm_lastname FROM admin WHERE user_id = ?",
        [userId]
      );
      profile = adm;
    }

    if (user.role === "student") {
      const [[std]] = await connection.execute(
        "SELECT std_name, std_lastname FROM student WHERE user_id = ?",
        [userId]
      );
      profile = std;
    }

    return res.json({
      user: {
        ...user,
        ...profile
      }
    });

  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }finally {
        connection.release();
    }
}
export default navbar;