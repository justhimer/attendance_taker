export async function responseErrorMsgHandler(res: Response): Promise<Error> {
    try{
        const status = res.status;
        const statusText = res.statusText;

        const resJson = await res.json();
        const message = resJson.message ? resJson.message : '';

        return new Error(`${message} (${status} ${statusText})`);
    } catch (error) {
        return new Error('Response Errors Handler Error.');
    }
}