import {Buffer} from "buffer";
import * as fs from "fs";
import {net, ProtocolRequest, session} from 'electron';
import {RequestsLoggerService} from "./requests-logger.service";


export const InterceptionService = new class InterceptionServiceSingleton {

    public async init(session: session): Promise<void> {

        session.protocol.interceptBufferProtocol("https", (req: ProtocolRequest, response) => {
            if (this.interceptOzonSummary(req.url, response))
                return;

            this.interceptAsDefault(req, response);
        })
    }

    private interceptOzonSummary(url, response): boolean {
        if (url === 'https://ozon.ru/api/composer-api.bx/_action/summary') {
            response(Buffer.from('[{"id":32933691,"name":"Кофе молотый Lavazza Qualita Oro, 250 г (в/у)","price":491,"quantity":1,"cart":"ozon","discountPrice":349,"totalPrice":349,"eGiftCardUid":""}]'));
            return true;
        }
    }

    private interceptAsDefault(req: ProtocolRequest, response): void {
        const request = net.request(req);

        request.on('response', res => {
            const chunks = [];

            res.on('data', chunk => chunks.push(Buffer.from(chunk)));
            res.on('end', async () => {
                RequestsLoggerService.logRequest({
                    pageUrl: req.url,
                    method: req.method,
                    requestUrl: req.url,
                    requestBody: req.uploadData ? req.uploadData[0]?.bytes.toString() : '',
                    responseBody: Buffer.concat(chunks)?.toString()
                });
                response(Buffer.concat(chunks));
            });
            res.on('error', (e) => console.log(e));
        })

        if (req.uploadData) {
            req.uploadData.forEach(part => {
                if (part.bytes) request.write(part.bytes)
                else if (part.file) request.write(fs.readFileSync(part.file))
            })
        }

        request.end();
    }

}