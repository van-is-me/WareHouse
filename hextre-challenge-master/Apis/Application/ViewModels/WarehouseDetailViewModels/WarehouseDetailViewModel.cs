﻿using Domain.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.ViewModels.WarehouseDetailViewModels
{
    public class WarehouseDetailViewModel
    {
        public Guid Id { get; set; }
        public Guid WarehouseId { get; set; }
        public double WarehousePrice { get; set; }
        public double ServicePrice { get; set; }
        public double Width { get; set; }
        public double Height { get; set; }
        public double Depth { get; set; }
        public string UnitType { get; set; }
        public int Quantity { get; set; }
        public bool IsDisplay { get; set; }


    }
}
