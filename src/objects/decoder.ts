import StdObject from "./base";
import { isBang } from "../sdk";
import type { IArgsMeta, IInletsMeta, IOutletsMeta } from "@jspatcher/jspatcher/src/core/objects/base/AbstractObject";
import * as OSC from "osc/dist/osc-browser";

export default class Decoder extends StdObject<[Blob | ArrayBuffer | Uint8Array], [OSC.ReadPacket<OSC.Argument, OSC.Message<OSC.Argument>>]> {
    static description = "OSC Data Decoder";
    static inlets: IInletsMeta = [{
        isHot: true,
        type: "anything",
        description: "Blob | ArrayBuffer | Uint8Array to decode"
    }];
    static outlets: IOutletsMeta = [{
        type: "anything",
        description: "Decoded OSC JSON data"
    }];
    static args: IArgsMeta = [{
        type: "anything",
        optional: true,
        description: "Initial value"
    }];
    subscribe() {
        super.subscribe();
        this.on("preInit", () => {
            this.inlets = 1;
            this.outlets = 1;
        });
        this.on("inlet", async ({ data, inlet }) => {
            if (inlet === 0) {
                if (!isBang(data)) {
                    let out: OSC.ReadPacket<OSC.Argument, OSC.Message<OSC.Argument>>;
                    if (data instanceof Blob) {
                        const ab = await data.arrayBuffer();
                        out = OSC.readPacket(ab, {});
                    } else {
                        out = OSC.readPacket(data, {});
                    }
                    this.outlet(0, out);
                }
            }
        });
    }
}
