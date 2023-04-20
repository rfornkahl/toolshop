export class GlobalConstants{
    //Global Error Message
    public static genericError:string = "Sorry a bug got into the computer fan again. Please try again later.";

    public static unauthorized : string = "You are not an authorized user to access this site.";

    public static productExistError:string = "Product already exists";

    public static productAdded:string = "Product has been added succesfully."

    //Regex
    public static nameRegex:string = "[a-zA-Z0-9 ]*";

    public static emailRegex:string = "[A-Za-z0-9._%-]+@[A-Za-z0-9._%-]+\\.[a-z]{2,3}";

    public static contactNumberRegex:string = "^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$";

    public static cityRegex:string = "^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$";

    public static stateRegex:string = "^((A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY]))$";
    public static zipCodeRegex:string = "^[0-9]{5}(?:-[0-9]{4})?$";

    public static streetCodeRegex:string = "^[a-zA-Z0-9 ]*";

    public static cardNumberRegex:string = "^(?:4[0-9]{12}(?:[0-9]{3})?|(?:5[1-5][0-9]{2}|222[1-9]|22[3-9][0-9]|2[3-6][0-9]{2}|27[01][0-9]|2720)[0-9]{12}|3[47][0-9]{13}|6(?:011|5[0-9]{2})[0-9]{12})$";

    public static expirationDateRegex:string = "^(0[1-9]|1[0-2])\/?([0-9]{2})$";

    public static cvvRegex:string = "^[0-9]{3,4}$";

    public static accountNumberRegex:string = "^(\d{3,12})$";

    public static routingNumberRegex:string = "^((0[0-9])|(1[0-2])|(2[1-9])|(3[0-2])|(6[1-9])|(7[0-2])|80)([0-9]{7})$";
    //Variable
    public static error:string = "error";

 

}