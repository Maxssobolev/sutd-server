export enum OrderStatus {
    notStated = 'не обработана',
    inProgress = 'в работе',
    done = 'закрыта'
}
export interface ClientUpdateDto {
    abonement_description: string,
    abonement_duration: number,
    abonement_id: number,
    abonement_price: number,
    abonement_title: string,
    client_dob: string,
    client_fio: string,
    client_id: number,
    client_ismember: false,
    client_phone: string,
    mentor_id: number,
    mentor_name: string,
    purchase_enddate: string,
    purchase_ispaid: false,
    purchase_paymentmethod: string,
    purchase_startdate: string,
    purchase_abonement_id: number | null,
    purchase_id: number | null,
    purchase_client_id: number | null,
}
export interface OrderUpdateDto extends ClientUpdateDto{
    order_client_id: number,
    order_createdat: string,
    order_id: number,
    order_mentor_id: number,
    order_notes: string,
    order_status: OrderStatus,
}