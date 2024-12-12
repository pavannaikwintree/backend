
export default class ApiResponse{
    constructor(success, data, message){
        this.success = success;
        if (data !== null && data !== undefined) {
          this.data = data;
        }
        this.message = message;
    }
}