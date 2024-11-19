import { handleRequest } from "./handleRequest";
import { responseError } from "./responseError";

export default {
    async fetch(request, env) {
        return handleRequest(request, env).catch(
            (err) => responseError(err.stack)
        )
    }
}
