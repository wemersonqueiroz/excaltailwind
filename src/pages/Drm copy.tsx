import React from "react"
import Images from "../images/Images"

function Drm1() {
  // Check wallet Connected
  // Upload file
  // Create Splits
  // Create DRM
  // Forward to Content URL based off of key of artwork

  // The url for the user

  return (
    <div className="container">
      <img className="w-2/6 max-w-sm" src={Images.private.logohead} alt="" />

      <div className="drm-form row my-5 mx-1" id="drm-form">
        <form>
          <input
            className="col-xl-12 col-md-12 col-sm-12 "
            name="recipientykey"
            id="recipient_key"
            type="text"
            placeholder="Public Key"
          />
          <input
            className="col-xl-12 col-md-12 col-sm-12 "
            name="percentage"
            id="recipient_percentage"
            type="number"
            placeholder="percentage"
          />
          <input
            className="col-xl-12 col-md-12 col-sm-12 "
            name="name"
            id="recipient_name"
            type="text"
            placeholder="Name (optional)"
          />
          <input
            className="col-xl-12 col-md-12 col-sm-12 "
            name="image"
            id="recipient_image"
            type="text"
            placeholder="Image (optional)"
          />
        </form>
        <div>
          <div className="drm-button container-fluid my-5 mx-5">
            <button type="submit" className="btn btn-secondary">
              Add Share
            </button>
            <button type="submit" className="btn btn-secondary">
              Clear
            </button>
            <button type="submit" className="btn btn-secondary">
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Drm1
