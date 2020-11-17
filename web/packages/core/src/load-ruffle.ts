/* eslint @typescript-eslint/no-explicit-any: "off" */

/**
 * Conditional ruffle loader
 */

import { Ruffle } from "../pkg/ruffle_web";

/**
 * Load ruffle from an automatically-detected location.
 *
 * This function returns a new instance of Ruffle and downloads it every time.
 * You should not use it directly; this module will memoize the resource
 * download.
 */
async function fetch_ruffle(): Promise<{ new (...args: any[]): Ruffle }> {
    try {
        //If runtime_path is defined then we are executing inside the extension
        //closure. In that case, we configure our local Webpack instance
        __webpack_public_path__ = runtime_path + "dist/";
    } catch (e) {
        //Checking an undefined closure variable usually throws ReferencError,
        //so we need to catch it here and continue onward.
        if (!(e instanceof ReferenceError)) {
            throw e;
        }
    }

    //We currently assume that if we are not executing inside the extension,
    //then we can use webpack to get Ruffle.
    const ruffle_module = await import("../pkg/ruffle_web");
    return ruffle_module.Ruffle;
}

let last_loaded_ruffle: Promise<{ new (...args: any[]): Ruffle }> | null = null;

/**
 * Obtain an instance of `Ruffle`.
 *
 * This function returns a promise which yields `Ruffle` asynchronously.
 */
export function load_ruffle(): Promise<{ new (...args: any[]): Ruffle }> {
    if (last_loaded_ruffle == null) {
        last_loaded_ruffle = fetch_ruffle();
    }

    return last_loaded_ruffle;
}
