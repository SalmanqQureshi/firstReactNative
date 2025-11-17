import moment from 'moment'

export const dateFormat = (d: any) => {
    return moment(d).format('YYYY-MM-DD')
  }
export const timeFormat = (t: any) => {
    return moment(t).format('HH:mm')
  }
export const showDate= (date) => moment(date).format('DD MMMM, YY')

export const _checkCurrentUser = (obj,user) =>{
 const userExistsAndCreator = obj?.some(item => item._id._id === user._id && item.is_creator === true);
 if (!userExistsAndCreator) return false;
 const hasTaskPermission = user.policies?.some(
   perm => perm.user === user._id && perm.module === "task" && perm.can_create === true
 );
 return hasTaskPermission;
}
export const _checkCurrentUserProject = (obj,user) =>{
 const userExistsAndCreator = obj === user._id; // If get a driect ID instead of user object
 if (!userExistsAndCreator) return false;
 const hasTaskPermission = user.policies?.some(
   perm => perm.user === user._id && perm.module === "project" && perm.can_create === true
 );
 return hasTaskPermission;
}