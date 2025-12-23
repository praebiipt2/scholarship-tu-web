const protectedRoute = (req,res) => {
    res.json({message: `Welcome User ${req.user.user_id}` })
}

export default protectedRoute;