//!! This is only one file, and should remain just a file. When their
//!! is a types folder it usually becomes a maze of structures for
//!! for all confusing one-off components and api responses. This is so,
//!! DO NOT CREATE A TYPES FOLDER
type UserRoles = "user"

export interface UserType {
    _id:number,
name:string,
user_type:string,
experience:string,
location_base:string,
distance_radius:number,
category:[],
slug:number,
email:string,
mobile_no:string,
image_url:string,
bio:string,
front_id:string,
back_id:string,
blur_image:string,
status:string,
is_email_verify:string,
is_mobile_verify:string,
country:string,
state:string,
city:string,
zipcode:string,
address:string,
latitude:string,
longitude:string,
api_token:string,
device_type:string,
device_token:string,
platform_type:string,
platform_id:string,
created_at:string,
}