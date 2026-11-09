import {
    createRestPeriodRequest,
    getAllRestPeriodRequests,
    getRestPeriodRequestsByEmployee,
    getRestPeriodRequestById,
    decideRestPeriodRequest,
} from "../service/restPeriodRequest.service.js";

export const createRestPeriodRequestController = async (req, res) => {
    try{
        const employeeId = req.user?._id;
        const restPeriodRequest = await createRestPeriodRequest(req.body, employeeId);
        return res.status(201).json(restPeriodRequest);

    }
    catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
}

export const getAllRestPeriodRequestsController = async (req, res) => {
    try {
        const filters = req.query; // Assuming filters are passed as query parameters
        const restPeriodRequests = await getAllRestPeriodRequests(filters);
        return res.status(200).json(restPeriodRequests);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Error fetching rest period requests" });
    }
};

export const getMyRestPeriodRequestsController = async (req, res) => {
    try {
        const requests = await getRestPeriodRequestsByEmployee(req.user?._id);
        return res.status(200).json(requests);
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: error.message });
    }
};

export const getRestPeriodRequestByIdController = async (req, res) => {
    try {
        const isSuperAdmin = String(req.user?.role || "")
            .toLowerCase()
            .replace(/[\s_-]/g, "") === "superadmin";
        const request = await getRestPeriodRequestById(
            req.params.id,
            isSuperAdmin ? undefined : req.user?._id
        );
        if (!request) {
            return res.status(404).json({ message: "Rest-period request not found" });
        }
        return res.status(200).json(request);
    } catch (error) {
        console.error(error);
        const status = error.name === "CastError" ? 400 : error.statusCode || 500;
        return res.status(status).json({ message: error.message });
    }
};

export const decideRestPeriodRequestController = async (req, res) => {
    try {
        const request = await decideRestPeriodRequest(
            req.params.id,
            req.body.status,
            req.body.decisionNote ?? req.body.decisionComment,
            req.user?._id
        );
        return res.status(200).json(request);
    } catch (error) {
        console.error(error);
        const status = error.name === "CastError" ? 400 : error.statusCode || 500;
        return res.status(status).json({ message: error.message });
    }
};