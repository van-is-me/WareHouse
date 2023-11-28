using Application.Repositories;

namespace Application
{
    public interface IUnitOfWork
    {
        public IChemicalRepository ChemicalRepository { get; }

        public IUserRepository UserRepository { get; }
        public ICategoryRepository CategoryRepository { get; }

        public IProviderRepository ProviderRepository { get; }
        public IWarehouseRepository WarehouseRepository { get; }
        public IWarehouseDetailRepository WarehouseDetailRepository { get; }
        public IOrderRepository OrderRepository { get; }
        public INoteRepository NoteRepository { get; }
        public IDepositRepository DepositRepository  { get; }
        public IPostCategoryRepository PostCategoryRepository { get; }
        public IHashtagRepository HashtagRepository { get; }
        public IPostRepository PostRepository { get; }
        public IPostHashtagRepository PostHashtagRepository { get; }

        public IRequestRepository RequestRepository { get; }
        public IRequestDetailRepository RequestDetailRepository { get; }
        public ITempRepository TransactionRepository { get; }

        public Task<int> SaveChangeAsync();
    }
}
