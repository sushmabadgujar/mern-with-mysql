import api from "./axios";

export const getAllActivityLogs = (params) => {
    return api.get("/activity-logs", {
        params,
    });
};

export const deleteActivityLog = (id) => {
    return api.delete(`/activity-logs/${id}`);
};

export const clearActivityLogs = () => {
    return api.delete("/activity-logs/clear/all");
};