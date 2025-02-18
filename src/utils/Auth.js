const auth = async () => {
    const authToken = JSON.parse(localStorage.getItem("token"));

    if (authToken) {
        return {
            check: true,
            token: authToken
        }
    } else {
        return { check: false }
    }
}

export default auth;