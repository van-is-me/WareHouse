using Application.Services.Momo;
using Domain.Entities;
using Infrastructures;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;

namespace WebAPI.Services
{
    public class MonthService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public MonthService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<bool> CalculateService()
        {
            var db = _context.Database.BeginTransaction();
            int month = DateTime.Now.Month;
            int year = DateTime.Now.Year;   
            int date = DateTime.Now.Day;
            try
            {
                var contracts = await _context.Contract.Where(x=>x.IsDeleted == false && x.StartTime < DateTime.Now  && x.StartTime.Day == date && x.ContractStatus == Domain.Enums.ContractStatus.OnGoing).ToListAsync();
                if (contracts==null||contracts.Count==0)
                {
                    return false;
                }
                else
                {
                    
                    foreach (var item in contracts)
                    {
                        var ser = new ServicePayment();
                        ser.MonthPayment = month;
                        ser.YearPayment = year;
                        ser.ContractId =item.Id;
                        ser.ServicePrice = item.ServicePrice;
                        ser.WarehousePrice = item.WarehousePrice;
                        ser.TotalPrice = item.ServicePrice + item.WarehousePrice;
                        ser.CreationDate = DateTime.Now;

                        await _context.ServicePayment.AddAsync(ser);
                        await _context.SaveChangesAsync();

                        var note = new Notification();
                        note.CreationDate = DateTime.Now;
                        note.ApplicationUserId = item.CustomerId;
                        note.Title = "Thông báo thanh toán hóa đơn tháng " + month + " năm " + year;
                        note.Description = "Đây là thông báo thanh toán hóa đơn tháng " + month + " năm " + year + ". Thời hạn thanh toán hóa đơn này là hết ngày " + DateTime.Now.AddDays(10).ToString("dd/MM/yyyy")+ ". Vui lòng truy cập vào mục hóa đơn để xem cho tiết. Warehouse Bridge xin chân thành cảm ơn!";

                        await _context.Notifications.AddAsync(note);
                        await _context.SaveChangesAsync();
                    }
                    db.Commit();
                }
            }
            catch (Exception ex)
            {
               db.Rollback();
                throw;
            }
            return true;
        }


        public async Task<string> Payment(ServicePayment ser)
        {
            string endpoint = _configuration["MomoServices:endpoint"];
            string partnerCode = _configuration["MomoServices:partnerCode"];
            string accessKey = _configuration["MomoServices:accessKey"];
            string serectkey = _configuration["MomoServices:secretKey"];
            string orderInfo = "Thanh toán hóa đơn tháng "+DateTime.Now.Month+" tại WarehouseBridge.";
            string redirectUrl = _configuration["MomoServices:serviceUrl"];
            string ipnUrl = _configuration["MomoServices:ipnServiceUrl"];
            string requestType = "captureWallet";
            string amount = ser.TotalPrice.ToString();
            string orderId = ser.Id.ToString();
            string requestId = Guid.NewGuid().ToString();
            string extraData = "Thanh toán hóa đơn tháng "+DateTime.Now.Month+" tại WarehouseBridge.";


            //Before sign HMAC SHA256 signature
            string rawHash = "accessKey=" + accessKey +
                "&amount=" + amount +
                "&extraData=" + extraData +
                "&ipnUrl=" + ipnUrl +
                "&orderId=" + orderId +
                "&orderInfo=" + orderInfo +
                "&partnerCode=" + partnerCode +
                "&redirectUrl=" + redirectUrl +
                "&requestId=" + requestId +
                "&requestType=" + requestType
            ;

            MoMoSecurity crypto = new MoMoSecurity();
            //sign signature SHA256
            string signature = crypto.signSHA256(rawHash, serectkey);



            //build body json request
            JObject message = new JObject
                 {
                { "partnerCode", partnerCode },
                { "partnerName", "Test" },
                { "storeId", "MomoTestStore" },
                { "requestId", requestId },
                { "amount", amount },
                { "orderId", orderId },
                { "orderInfo", orderInfo },
                { "redirectUrl", redirectUrl },
                { "ipnUrl", ipnUrl },
                { "lang", "en" },
                { "extraData", extraData },
                { "requestType", requestType },
                { "signature", signature }

                };
            try
            {
                string responseFromMomo = PaymentRequest.sendPaymentRequest(endpoint, message.ToString());

                JObject jmessage = JObject.Parse(responseFromMomo);

                return jmessage.GetValue("payUrl").ToString();
            }
            catch
            {
                throw new Exception("Đã xảy ra lối trong qua trình thanh toán. Vui lòng thanh toán lại sau!");
            }
        }


        public async Task<bool> StartContract()
        {
            try
            {
                var contracts = await _context.Contract.Where(x => !x.IsDeleted && x.ContractStatus == Domain.Enums.ContractStatus.Pending && x.StartTime.Date == DateTime.Now.Date).ToListAsync();
                foreach (var item in contracts)
                {
                    item.ContractStatus = Domain.Enums.ContractStatus.OnGoing;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return true;
        }


        public async Task<bool> EndContract()
        {
            try
            {
                var contracts = await _context.Contract.Where(x => !x.IsDeleted && x.ContractStatus == Domain.Enums.ContractStatus.OnGoing && x.EndTime.Date == DateTime.Now.Date).ToListAsync();
                foreach (var item in contracts)
                {
                    item.ContractStatus = Domain.Enums.ContractStatus.Terminating;
                    await _context.SaveChangesAsync();
                }

                var temp = await _context.Contract.Include(x=>x.ServicePayments).Where(x => !x.IsDeleted && x.ContractStatus == Domain.Enums.ContractStatus.OnGoing && x.ServicePayments.Where(a=>!a.IsPaid && a.Deadline.Date<DateTime.Now && !a.IsDeleted).ToList().Any()).ToListAsync();
                foreach (var item in temp)
                {
                    item.ContractStatus = Domain.Enums.ContractStatus.Expired;
                    await _context.SaveChangesAsync();
                }
            }
            catch (Exception)
            {

                throw;
            }
            return true;
        }
    }
}
