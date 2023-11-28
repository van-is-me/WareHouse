using Application.ViewModels.ChemicalsViewModels;
using AutoMapper;
using Application.Commons;
using Domain.Entities;
using Application.ViewModels.CategoryViewModels;
using Application.ViewModels.ProviderViewModels;
using Application.ViewModels.WarehouseViewModel;
using Application.ViewModels.ImageWarehouseViewModels;
using Application.ViewModels.WarehouseDetailViewModels;
using Application.ViewModels.OrderViewModels;
using Application.ViewModels.PostCategoryViewModels;
using Application.ViewModels.HashtagViewModels;
using Application.ViewModels.PostViewModels;
using Application.ViewModels.ContractViewModels;
using Application.ViewModels.AuthViewModel;
using Application.ViewModels.GoodViewModels;
using Application.ViewModels.RequestViewModels;
using Application.ViewModels.RequestDetailViewModel;

namespace Infrastructures.Mappers
{
    public class MapperConfigurationsProfile : Profile
    {
        public MapperConfigurationsProfile()
        {
            CreateMap<CreateChemicalViewModel, Chemical>();
            CreateMap(typeof(Pagination<>), typeof(Pagination<>));
            CreateMap<Chemical, ChemicalViewModel>()
                .ForMember(dest => dest._Id, src => src.MapFrom(x => x.Id));
            CreateMap<CreateCategoryViewModel, Category>().ReverseMap();
            CreateMap<UpdateCategoryViewModel, Category>().ReverseMap();
            CreateMap<CategoryViewModel, Category>().ReverseMap();

            CreateMap<CreateProviderViewModel, Provider>().ReverseMap();
            CreateMap<UpdateProviderViewModel, Provider>().ReverseMap();

            CreateMap<Provider, ProviderViewModel>().ForMember(des => des.WarehousesCount, src => src.MapFrom(x => x.Warehouses.Count))
                .ReverseMap();

            CreateMap<WarehoureUpdateModel, Warehouse>().ReverseMap();
            CreateMap<WarehourseCreateModel, Warehouse>().ReverseMap();
            CreateMap<Warehouse, WarehouseViewModel>()
                .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category.Name))
                .ForMember(dest => dest.ProviderName, opt => opt.MapFrom(src => src.Provider.Name))
                .ForMember(dest => dest.imageURL, opt => opt.MapFrom(src => src.ImageWarehouses.FirstOrDefault().ImageURL));

            CreateMap<WarehouseDetailViewModel, WarehouseDetail>().ReverseMap();
            CreateMap<WarehouseDetailCreateModel, WarehouseDetail>().ReverseMap();
            CreateMap<WarehouseDetail, WarehouseDetailUpdateModel>().ReverseMap();

            CreateMap<ImageWarehouseViewModel, ImageWarehouse>().ReverseMap();
            CreateMap<ImageWarehouseCreateModel, ImageWarehouse>().ReverseMap();


            CreateMap<OrderViewModel, Order>().ReverseMap();
            /*CreateMap<ImageWarehouseCreateModel, ImageWarehouse>().ReverseMap();*/

            CreateMap<PostCategoryViewModel, PostCategory>().ReverseMap();
            CreateMap<CreatePostCategoryViewModel, PostCategory>().ReverseMap();
            CreateMap<UpdatePostCategoryViewModel, PostCategory>().ReverseMap();

            CreateMap<CreateHashtagViewModel, Hashtag>().ReverseMap();
            CreateMap<UpdateHashtagViewModel, Hashtag>().ReverseMap();
            CreateMap<HashtagViewModel, Hashtag>().ReverseMap();

            CreateMap<CreatePostViewModel, Post>().ReverseMap();
            CreateMap<Post, PostViewModel>()
                .ForMember(des => des.NamePostCategory, src => src.MapFrom(x => x.PostCategory.Name))
                .ForMember(des => des.FullnameAuthor, src => src.MapFrom(x => x.Author.Fullname))
                .ReverseMap();
            CreateMap<UpdatePostViewModel, Post>().ReverseMap();


            CreateMap<ContractModel, Contract>().ReverseMap();


            CreateMap<ApplicationUser, UpdateAuthViewModel>().ReverseMap();
            CreateMap<GoodViewModel, Good>().ReverseMap();
            CreateMap<GoodCreateModel, Good>().ReverseMap();
            CreateMap<RequestModel, Request>().ReverseMap();
            CreateMap<Request, RequestModel>()
                .ForMember(des => des.StaffName, src => src.MapFrom(x => x.Customer.Fullname))
                .ForMember(des => des.CustomerName, src => src.MapFrom(x => x.Customer.Fullname)).ReverseMap();
            CreateMap<CreateRequestViewModel, Request>()
            .ForMember(dest => dest.Details, opt => opt.MapFrom(src => src.RequestDetails)).ReverseMap();
            CreateMap<UpdateRequestViewModel, Request>().ReverseMap();
            CreateMap<RequestDetail, RequestDetailViewModel>().ReverseMap();
            CreateMap<CreateRequestDetailViewModel, RequestDetail>().ReverseMap();
            CreateMap<UpdateRequestDetailViewModel, RequestDetail>().ReverseMap();

        }
    }
}
