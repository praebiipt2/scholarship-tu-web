import pool from "../pool.js";

const logout = async (req, res) => {
    const token = req.token

    /* ลบ token จากตาราง */
    await pool.execute("DELETE FROM users_session WHERE token = ?", [token])
    return res.json({ message: "Logout successful" });
}

export default logout;