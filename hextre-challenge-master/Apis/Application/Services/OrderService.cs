using Application.Interfaces;
using Application.Services.Momo;
using Application.ViewModels.OrderViewModels;
using Domain.Entities;
using Domain.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Ocsp;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class OrderService : IOrderService
    {
        private readonly IUnitOfWork _unit;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IConfiguration _configuration;

        public OrderService(IUnitOfWork unit, UserManager<ApplicationUser> userManager, IConfiguration configuration)
        {
            _unit = unit;
            _userManager = userManager;
            _configuration = configuration;
        }
        public async Task<Guid> CreateOrder(OrderCreateModel model)
        {
            var Customer = await _userManager.Users.SingleOrDefaultAsync(x => x.Id.ToLower().Equals(model.CustomerId.ToLower()));
            if (Customer == null)
            {
                throw new Exception("Không tìm thấy khách hàng bạn yêu cầu");
            }
            var warehouseDetail = await _unit.WarehouseDetailRepository.GetByIdAsync(model.WarehouseDetailId);
            if (warehouseDetail == null)
            {
                throw new Exception("Không tìm thấy chi tiết kho bạn yêu cầu");
            }
            if (warehouseDetail.Quantity <= 0)
            {
                throw new Exception("Kho này hiện đang hết. Vui lòng đặt lại sau!");
            }
            var order = new Order();
            order.CustomerId = model.CustomerId;
            order.WarehouseDetailId = model.WarehouseDetailId;
            order.ContactInDay = false;
            order.TotalCall = 0;
            order.OrderStatus = OrderStatus.Pending;
            order.WarehousePrice = warehouseDetail.WarehousePrice;
            order.ServicePrice = warehouseDetail.ServicePrice;
            order.Deposit = warehouseDetail.WarehousePrice + warehouseDetail.ServicePrice;
            order.TotalPrice = order.Deposit *2;
            
            order.Width = warehouseDetail.Width;
            order.Height = warehouseDetail.Height;
            order.Depth = warehouseDetail.Depth;
            order.UnitType = warehouseDetail.UnitType;
            order.PaymentStatus = PaymentStatus.Waiting;

            await _unit.OrderRepository.AddAsync(order);
            await _unit.SaveChangeAsync();
            return order.Id;
        }

        public async Task<string> Payment(Order order)
        {
            string endpoint =  _configuration["MomoServices:endpoint"];
            string partnerCode = _configuration["MomoServices:partnerCode"];
            string accessKey = _configuration["MomoServices:accessKey"];
            string serectkey = _configuration["MomoServices:secretKey"];
            string orderInfo = "Thanh toán đơn hàng tại WarehouseBridge.";
            string redirectUrl = _configuration["MomoServices:redirectUrl"];
            string ipnUrl = _configuration["MomoServices:ipnUrl"];
            string requestType = "captureWallet";
            string amount = order.TotalPrice.ToString();
            string orderId = order.Id.ToString();
            string requestId = Guid.NewGuid().ToString();
            string extraData = "Thanh toán đơn hàng tại WarehouseBridge.";
            

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


    }
}
