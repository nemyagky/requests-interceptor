import {Buffer} from "buffer";
import * as fs from "fs";
import {ClientRequest, net, ProtocolRequest, session, UploadData} from 'electron';
import {RequestsLoggerService} from "./requests-logger.service";
import {CustomUrlsInterceptorService} from "./custom-urls-interseptor.service";


// We should use ?decorator? pattern during adding new custom requests
export const InterceptorService = new class InterceptorServiceSingleton {

    public async startIntercepting(session: session): Promise<void> {
        session.protocol.interceptBufferProtocol("https", (req: ProtocolRequest, response) => {
            // Bad line
            if (CustomUrlsInterceptorService.interceptOzonUrl(req, response))
                return;

            this.interceptAsDefault(req, response);
        })
    }

    private interceptAsDefault(req: ProtocolRequest, response): void {
        const request = net.request(req);

        if (req.uploadData)  {
            this.sendRequestBody(req.uploadData, request);
        }

        request.on('response', res => {
            const chunks: Buffer[] = [];

            res.on('data', chunk => chunks.push(Buffer.from(chunk)));
            res.on('end', async () => {
                this.logRequest(req, chunks);
                response(Buffer.concat(chunks));
            });
            res.on('error', (e) => console.log(e));
        });
        request.end();
    }

    private sendRequestBody(requestData: UploadData[], request: ClientRequest) {
        requestData.forEach(part => {
            if (part.bytes) request.write(part.bytes)
            else if (part.file) request.write(fs.readFileSync(part.file))
        })
    }

    private logRequest(req: ProtocolRequest, responseChunks): void {
        RequestsLoggerService.logRequest({
            pageUrl: req.referrer,
            method: req.method,
            requestUrl: req.url,
            requestBody: req.uploadData ? req.uploadData[0]?.bytes?.toString() : '',
            responseBody:  Buffer.concat(responseChunks)?.toString()
        });
    }

}