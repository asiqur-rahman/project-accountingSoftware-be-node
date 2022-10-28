import React from "react"

//Import Breadcrumb
import Breadcrumbs from "../../components/Common/Breadcrumb"

const PagesStarter = () => {
  return (
    <>
      <div className="page-content">

          {/* Render Breadcrumbs */}
          <Breadcrumbs title="Pages" breadcrumbItem="Starter Page" />

      </div>
    </>
  )
}

export default PagesStarter
