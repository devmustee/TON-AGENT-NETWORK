"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tillNextSeqno = void 0;
const tillNextSeqno = async (wallet, oldSeqno, maxTries = 10) => {
    let seqNoAfter = oldSeqno;
    let tried = 0;
    do {
        await new Promise((resolve, reject) => {
            setTimeout(resolve, 2000);
        });
        seqNoAfter = await wallet.getSeqno();
        if (tried++ > maxTries) {
            throw Error("To many retries, transaction likely failed!");
        }
    } while (seqNoAfter == oldSeqno);
};
exports.tillNextSeqno = tillNextSeqno;
