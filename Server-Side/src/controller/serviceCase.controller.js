import {createServiceCase, getServiceCaseById,
     getAllServiceCases, updateServiceCaseStatus} from "../service/serviceCase.service.js";

const mountedCaseType = (req) => {
    if (req.baseUrl.endsWith("/complaints")) return "complaint";
    if (req.baseUrl.endsWith("/service-requests")) return "service_request";
    return undefined;
};

     export const createServiceCaseController = async (req, res) => {
        try {
            const serviceCase = await createServiceCase({
                ...req.body,
                caseType: mountedCaseType(req) ?? req.body.caseType,
            }, req.user.id);
            return res.status(201).json(serviceCase);
        } catch (error) {
            return res.status(error.statusCode || 400).json({ message: error.message });
        }
    };

    export const getMyServiceCasesController = async (req, res) => {
        try {
            const { caseType } = req.query;
            if (caseType && !["service_request", "complaint"].includes(caseType)) {
                return res.status(400).json({ message: "Invalid case type" });
            }
            const serviceCases = await getAllServiceCases({
                citizenId: req.user.id,
                ...(caseType ? { caseType } : {}),
            });
            return res.status(200).json(serviceCases);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    export const getServiceCaseByIdController = async (req, res) => {
        try {
            const serviceCase = await getServiceCaseById(req.params.id);
        if (!serviceCase) {
            return res.status(404).json({ message: "Service case not found" });
        }
        const expectedType = mountedCaseType(req);
        if (expectedType && serviceCase.caseType !== expectedType) {
            return res.status(404).json({ message: "Service case not found" });
        }
        return res.json(serviceCase);
        } catch (error) {
            const status = error.name === "CastError" ? 400 : 500;
            return res.status(status).json({ message: error.message });
        }
    };
    export const getAllServiceCasesController = async (req, res) => {
        try {
            const caseType = mountedCaseType(req) ?? req.query.caseType;
            const serviceCases = await getAllServiceCases({
                ...req.query,
                ...(caseType ? { caseType } : {}),
            });
            return res.json(serviceCases);
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    };

    export const updateServiceCaseStatusController = async (req, res) => {
        try {
            const serviceCase = await updateServiceCaseStatus(
                req.params.id,
                req.body.status,
                req.body.resolution ?? req.body.resolutionNote,
                mountedCaseType(req)
            );
            if (!serviceCase) {
                return res.status(404).json({ message: "Service case not found" });
            }
            return res.status(200).json(serviceCase);
        } catch (error) {
            const status = error.name === "CastError" ? 400 : error.statusCode || 500;
            return res.status(status).json({ message: error.message });
        }
    };