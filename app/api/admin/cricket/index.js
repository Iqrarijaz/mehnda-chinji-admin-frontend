import { Axios } from "@/interceptors";

/**
 * Admin Cricket API client — /api/admin/v1/cricket/*
 *
 * Every endpoint here sits behind validateAdminSession on the backend and
 * additionally requires a cricket.* permission, so the auth token attached by
 * the shared Axios interceptor is all these calls need to carry.
 *
 * List endpoints are normalised into the { docs, totalDocs, limit, page,
 * totalPages } shape the portal's antd tables expect.
 */

const BASE = "/api/admin/v1/cricket";

function toTableShape(response) {
    const { data, pagination } = response.data || {};
    return {
        data: {
            docs: data || [],
            totalDocs: pagination?.total || 0,
            limit: pagination?.limit || 20,
            page: pagination?.page || 1,
            totalPages: pagination?.totalPages || 1
        }
    };
}

/**
 * Drop empty filters so the backend Joi query schemas — which reject unknown
 * or malformed values — only ever see the filters actually in use.
 */
function cleanParams(params = {}) {
    return Object.entries(params).reduce((acc, [key, value]) => {
        if (value === null || value === undefined || value === "") return acc;
        if (key === "onChangeSearch") return acc;
        acc[key] = value;
        return acc;
    }, {});
}

/* ----------------------------- Tournaments ----------------------------- */

export async function GET_CRICKET_TOURNAMENTS(params) {
    const response = await Axios.get(`${BASE}/tournaments`, { params: cleanParams(params) });
    return toTableShape(response);
}

export async function GET_CRICKET_TOURNAMENT_STATUS_COUNTS() {
    const response = await Axios.get(`${BASE}/tournaments/status-counts`);
    return response.data;
}

export async function GET_CRICKET_TOURNAMENT_DETAILS(id) {
    const response = await Axios.get(`${BASE}/tournaments/${id}`);
    return response.data;
}

export async function CREATE_CRICKET_TOURNAMENT(data) {
    const response = await Axios.post(`${BASE}/tournaments`, data);
    return response.data;
}

export async function UPDATE_CRICKET_TOURNAMENT({ id, ...data }) {
    const response = await Axios.put(`${BASE}/tournaments/${id}`, data);
    return response.data;
}

export async function DELETE_CRICKET_TOURNAMENT(id) {
    const response = await Axios.delete(`${BASE}/tournaments/${id}`);
    return response.data;
}

export async function ASSIGN_CRICKET_TOURNAMENT_ADMIN({ id, targetUserId, action }) {
    const response = await Axios.post(`${BASE}/tournaments/${id}/admin`, { targetUserId, action });
    return response.data;
}

/* -------------------------- Teams & squads ----------------------------- */

export async function GET_CRICKET_TEAMS(params) {
    const response = await Axios.get(`${BASE}/teams`, { params: cleanParams(params) });
    return toTableShape(response);
}

export async function REGISTER_CRICKET_TEAM({ tournamentId, ...data }) {
    const response = await Axios.post(`${BASE}/tournaments/${tournamentId}/teams`, data);
    return response.data;
}

export async function UPDATE_CRICKET_TEAM({ tournamentId, teamId, ...data }) {
    const response = await Axios.put(`${BASE}/tournaments/${tournamentId}/teams/${teamId}`, data);
    return response.data;
}

export async function DELETE_CRICKET_TEAM({ tournamentId, teamId }) {
    const response = await Axios.delete(`${BASE}/tournaments/${tournamentId}/teams/${teamId}`);
    return response.data;
}

/* -------------------------- Admins & scorers --------------------------- */

export async function GET_CRICKET_ADMINS(params) {
    const response = await Axios.get(`${BASE}/admins`, { params: cleanParams(params) });
    return toTableShape(response);
}

/* ------------------------- Matches & fixtures -------------------------- */

export async function GET_CRICKET_MATCHES(params) {
    const response = await Axios.get(`${BASE}/matches`, { params: cleanParams(params) });
    return toTableShape(response);
}

export async function GET_CRICKET_MATCH_STATUS_COUNTS() {
    const response = await Axios.get(`${BASE}/matches/status-counts`);
    return response.data;
}

export async function GET_CRICKET_MATCH_DETAILS(id) {
    const response = await Axios.get(`${BASE}/matches/${id}`);
    return response.data;
}

export async function SCHEDULE_CRICKET_MATCH({ tournamentId, ...data }) {
    const response = await Axios.post(`${BASE}/tournaments/${tournamentId}/matches`, data);
    return response.data;
}

export async function UPDATE_CRICKET_MATCH({ id, ...data }) {
    const response = await Axios.put(`${BASE}/matches/${id}`, data);
    return response.data;
}

export async function DELETE_CRICKET_MATCH(id) {
    const response = await Axios.delete(`${BASE}/matches/${id}`);
    return response.data;
}

/* ---------------------------- Live scoring ----------------------------- */

export async function RECORD_CRICKET_TOSS({ id, tossWinnerId, tossDecision }) {
    const response = await Axios.patch(`${BASE}/matches/${id}/toss`, { tossWinnerId, tossDecision });
    return response.data;
}

export async function POST_CRICKET_OVER({ id, ...data }) {
    const response = await Axios.patch(`${BASE}/matches/${id}/over`, data);
    return response.data;
}
