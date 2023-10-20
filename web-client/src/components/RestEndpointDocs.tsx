import SwaggerUiReact from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

const RestEndpointDocs = function () {
  return (
    <div className="mt-10 bg-white">
      <SwaggerUiReact url="/app-v1-openapi.yaml" />
    </div>
  )
}
export default RestEndpointDocs
