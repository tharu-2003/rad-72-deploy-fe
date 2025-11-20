import api from "./api"

export const login = async (username: string , password: string) => {
    const resp = await api.post("/auth/login" , {email: username , password})    // base url athi bawin ethnin passe kotasa methnadi diya hakiya

    return resp.data
}

export const register = async ( username: string , password: string , firstname:string, lastname:string ) => {
    const resp = await api.post("/auth/register", {email: username , password, firstname, lastname })

    return resp.data
}

export const getMyDetails = async () => {
    const resp = await api.get("/auth/me")

    return resp.data
}

export const refreshTokens = async (refreshToken: string) => {
    const res = await api .post("/auth/refresh", {token:refreshToken})

    return res.data
}
