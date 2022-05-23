const button: string =
  "text-md bg-clrSecondary px-6 py-2 text-sm text-clrLight font-semibold rounded-full border border-clrLight my-4 hover:text-clrLight hover:bg-clrDarkBlue hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1"

const form: string =
  "p-2 text-xs text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-xl"

const loginForm: string =
  "p-2 text-xs w-full text-clrDark font-medium rounded border border-clrLight my-4 text-center hover:border-transparent focus:outline-none focus:ring-1 focus:ring-clrDarkBlue focus:ring-offset-1 md:text-lg"

function DrmArtist(props: any) {
  const shouldHaveTrashCan = props.shouldHaveTrashCan as boolean
  const startingWallet = props.startingWallet as string
  const onDelete = props.onDelete as () => void
  const onWalletChange = props.onWalletChange as (wallet: string) => void
  const onNameChange = props.onNameChange as (name: string) => void
  const onRoleChange = props.onRoleChange as (role: string) => void
  const onPercentChange = props.onPercentChange as (percent: string) => void

  const updateWallet = (e: React.ChangeEvent<HTMLInputElement>) => {
    onWalletChange(e.target.value)
  }

  const updateName = (e: React.ChangeEvent<HTMLInputElement>) => {
    onNameChange(e.target.value)
  }

  const updateRole = (e: React.ChangeEvent<HTMLInputElement>) => {
    onRoleChange(e.target.value)
  }

  const updatePercent = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onPercentChange(e.target.value)
  }

  const renderTrashCan = () => {
    if (!shouldHaveTrashCan) {
      return null
    }

    return (
      <button className={`hover:bg-red-500 ${button}`} onClick={onDelete}>
        {" "}
        <i className="text-clrLight justify-center items-center fa-solid fa-trash-can" />
      </button>
    )
  }

  return (
    <div className="container flex flex-col md:flex-row items-end   space-x-4">
      <div className="container flex flex-col  ">
        <label>Wallet</label>
        <input
          type="text"
          className={loginForm}
          name="walletInput"
          defaultValue={startingWallet}
          onChange={updateWallet}
        />{" "}
      </div>
      <div className="container flex flex-col">
        <label>Name</label>
        <input
          type="text"
          className={loginForm}
          name="nameInput"
          onChange={updateName}
        />{" "}
      </div>

      <div className="container flex flex-col">
        <label>Percentage</label>
        <select
          defaultValue={100}
          className={`text-center ${loginForm}`}
          name="percentageInput"
          onChange={updatePercent}>
          <option value="5">5%</option>
          <option value="10">10%</option>
          <option value="15">15%</option>
          <option value="20">20%</option>
          <option value="25">25%</option>
          <option value="30">30%</option>
          <option value="35">35%</option>
          <option value="40">40%</option>
          <option value="45">45%</option>
          <option value="50">50%</option>
          <option value="55">55%</option>
          <option value="60">60%</option>
          <option value="65">65%</option>
          <option value="70">70%</option>
          <option value="75">75%</option>
          <option value="80">80%</option>
          <option value="85">85%</option>
          <option value="90">90%</option>
          <option value="95">95%</option>
          <option value="100">100%</option>
        </select>
      </div>
      {renderTrashCan()}
    </div>
  )
}

export default DrmArtist
