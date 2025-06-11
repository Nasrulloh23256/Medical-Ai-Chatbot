import type { route as routeFn } from "ziggy-js";
import { AxiosStatic } from "axios";

declare global {
    const route: typeof routeFn;
    interface Window {
        axios: AxiosStatic;
    }
}
