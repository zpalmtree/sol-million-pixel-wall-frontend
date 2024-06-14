import {
    Connection,
    Transaction,
} from '@solana/web3.js';

async function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export class TransactionSender {
    private retry: boolean = true;

    private sendAttempts: number = 0;

    private jitoConnection = new Connection('https://mainnet.block-engine.jito.wtf/api/v1/transactions');

    private signature: string | undefined;

    private confirmInProgress: boolean = false;

    private confirmed: boolean = false;

    constructor(
        private connection: Connection,
        private transaction: Transaction,
        private maxAttempts: number = 30,
        private sleepDuration: number = 3000,
        private useJito: boolean = true,
    ) {
    }

    public async sendAndConfirmTransaction() {
        const simulation = await this.connection.simulateTransaction(this.transaction);

        let simulationAttempts = 0;

        while (simulationAttempts < 3) {
            if (simulation.value.err) {
                if (simulation.value.err === 'BlockhashNotFound') {
                    console.log(`Blockhash not found, retrying simulation, attempt ${simulationAttempts}...`);
                    simulationAttempts++;
                    continue;
                }

                console.log(simulation);

                const error = simulation.value.logs?.join('\n') || simulation.value.err;

                return {
                    error,
                    timeout: false,
                    signature: undefined,
                    slot: undefined,
                };
            } else {
                break;
            }
        }

        const serialized = this.transaction.serialize();

        console.log(`Transaction size: ${serialized.length}`);

        let signature;
        let resultPromise: any;

        const checkInterval = 100; // Check `this.retry` every 100ms
        const iterations = this.sleepDuration / checkInterval;

        while (this.retry && this.sendAttempts < this.maxAttempts) {
            signature = await this.attemptSendTransaction(serialized);

            if (!this.confirmInProgress && signature) {
                resultPromise = this.waitForTransactionToConfirm(signature);
                this.confirmInProgress = true;
            }

            // Wait for `this.sleepDuration`, checking `this.retry` every `checkInterval`
            for (let i = 0; i < iterations; i++) {
                if (!this.retry) {
                    break;
                }

                await sleep(checkInterval);
            }
        }

        if (this.confirmed && signature) {
            const { value, context } = await resultPromise;

            if (value.err) {
                return {
                    error: value.err,
                    timeout: false,
                    slot: undefined,
                    signature: undefined,
                };
            }

            console.log(`Successfully confirmed transaction ${signature}, attempts: ${this.sendAttempts}.`);

            return {
                error: undefined,
                timeout: false,
                slot: context.slot,
                signature,
            };
        }

        return {
            error: undefined,
            timeout: true,
            slot: undefined,
            signature: undefined,
        };
    }

    private async waitForTransactionToConfirm(signature: string) {
        try {
            const result = await this.connection.confirmTransaction(signature, 'confirmed');
            this.confirmed = true;
            return result;
        } catch (err) {
            console.log(`Failed to confirm transaction ${signature}: (${err})`);
            return err;
        } finally {
            this.retry = false;
        }
    }

    private async attemptSendTransaction(serialized: Uint8Array): Promise<string | undefined> {
        try {
            const connection = this.useJito ? this.jitoConnection : this.connection;

            const signature = await connection.sendRawTransaction(
                serialized,
                {
                    skipPreflight: true,
                    maxRetries: 0,
                },
            );

            this.sendAttempts++;

            console.log(`Sending transaction https://solscan.io/tx/${signature}, attempt ${this.sendAttempts}`);

            return signature;
        } catch (err) {
            this.sendAttempts++;

            console.log(`Error executing transaction: ${err}`);
        }
    }
}
