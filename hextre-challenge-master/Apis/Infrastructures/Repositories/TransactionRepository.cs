using Application;
using Application.Interfaces;
using Application.Repositories;
using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels.WarehouseViewModel;
using AutoMapper;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructures.Repositories
{
    public class TransactionRepository : ITransactionRepository
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TransactionRepository(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;

        }

        public async Task CreateWarehouseWithImage(WarehourseCreateModel warehouse, IList<ImageWarehouseCreateModel> listImages)
        {
            var myTransaction = _context.Database.BeginTransaction();
            try
            {
                
                var warehouseId = await CreateWarehouse(warehouse);
                foreach (var item in listImages)
                {
                    item.WarehouseId = warehouseId;
                    await CreateImage(item);
                }
                myTransaction.Commit();

            }
            catch (Exception ex)
            {
                myTransaction.Rollback();

                throw new Exception(ex.Message);
            }
        }

        public async Task<Guid> CreateWarehouse(WarehourseCreateModel model)
        {
            try
            {
                var provider = await _context.Provider.FirstOrDefaultAsync(x => x.IsDeleted == false && x.Id == model.ProviderId);
                if(provider == null)
                {
                    throw new Exception("Không tìm thấy nhà cung cấp này");
                }
                var cate = await _context.Category.FirstOrDefaultAsync(x => x.IsDeleted == false && x.Id == model.CategoryId);
                if (cate == null)
                {
                    throw new Exception("Không tìm thấy danh mục này");
                }
                var warehouse = _mapper.Map<Warehouse>(model);
                warehouse.IsDisplay = true;
                await _context.Warehouse.AddAsync(warehouse);
                await _context.SaveChangesAsync();
                return warehouse.Id;
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task CreateImage(ImageWarehouseCreateModel model)
        {
            try
            {
                var image = _mapper.Map<ImageWarehouseCreateModel, ImageWarehouse>(model);
                await _context.ImageWarehouse.AddAsync(image);
                await _context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        }


    }
}
