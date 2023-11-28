using Application.ViewModels.OrderViewModels;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Interfaces
{
    public interface IOrderService
    {
        public Task<Guid> CreateOrder(OrderCreateModel model);
        public Task<string> Payment(Order order);
    }
}
