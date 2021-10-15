export const renderMemberAbstract = (appId: string) => {
  switch (appId) {
    case 'parenting':
      return (
        <p className="fc-black">
          若需修改密碼、會員資料，
          <a href="http://member.parenting.com.tw/account" target="_blank" className="primary" rel="noreferrer">
            請點此
          </a>
          ，登入後進行修改。
        </p>
      )
    default:
      return <></>
  }
}
