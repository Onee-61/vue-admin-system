import hasPerm from './permission/hasPerm'
import hasRole from './permission/hasRole'

export default function directive(app){
  app.directive('hasRole', hasRole)
  app.directive('hasPerm', hasPerm)
}
