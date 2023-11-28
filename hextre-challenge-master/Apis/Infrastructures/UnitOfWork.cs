using Application;
using Application.Repositories;
using Infrastructures.Repositories;

namespace Infrastructures
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly AppDbContext _dbContext;
        private readonly IChemicalRepository _chemicalRepository;
        private readonly IUserRepository _userRepository;
        private readonly IWarehouseRepository _warehouseRepository;
        private readonly ICategoryRepository _categoryRepository;
        private readonly IProviderRepository _providerRepository;
        private readonly IWarehouseDetailRepository _warehouseDetailRepository;
        private readonly IOrderRepository _orderRepository;
        private readonly INoteRepository _noteRepository;
        private readonly IDepositRepository _depositRepository;
        private readonly IPostCategoryRepository _postCategoryRepository;
        private readonly IHashtagRepository _hashtagRepository;
        private readonly IPostRepository _postRepository;
        private readonly IPostHashtagRepository _postHashtagRepository;
        private readonly IRequestRepository _requestRepository;
        private readonly IRequestDetailRepository _requestDetailRepository;
        private readonly ITempRepository _transactionRepository;


        public UnitOfWork(AppDbContext dbContext,
            IChemicalRepository chemicalRepository,
            IUserRepository userRepository,
            IWarehouseRepository warehouseRepository,
            ICategoryRepository categoryRepository,
            IProviderRepository providerRepository,
            IWarehouseDetailRepository warehouseDetailRepository,
            IOrderRepository orderRepository,
            INoteRepository noteRepository,
            IDepositRepository depositRepository,
            IPostCategoryRepository postCategoryRepository,
            IHashtagRepository hashtagRepository,
            IPostRepository postRepository,
            IPostHashtagRepository postHashtagRepository,
            IRequestRepository requestRepository,
            IRequestDetailRepository requestDetailRepository, ITempRepository transactionRepository)
        {
            _dbContext = dbContext;
            _chemicalRepository = chemicalRepository;
            _userRepository = userRepository;
            _warehouseRepository = warehouseRepository;
            _categoryRepository = categoryRepository;
            _providerRepository = providerRepository;
            _warehouseDetailRepository = warehouseDetailRepository;
            _orderRepository = orderRepository;
            _noteRepository = noteRepository;
            _depositRepository = depositRepository;
            _postCategoryRepository = postCategoryRepository;
            _hashtagRepository = hashtagRepository;
            _postRepository = postRepository;
            _postHashtagRepository = postHashtagRepository;
            _requestRepository = requestRepository;
            _requestDetailRepository = requestDetailRepository;
            _transactionRepository = transactionRepository;
        }
        public IChemicalRepository ChemicalRepository => _chemicalRepository;

        public IUserRepository UserRepository => _userRepository;

        public ICategoryRepository CategoryRepository => _categoryRepository;

        public IProviderRepository ProviderRepository => _providerRepository;

        public IWarehouseRepository WarehouseRepository => _warehouseRepository;

        public IWarehouseDetailRepository WarehouseDetailRepository => _warehouseDetailRepository;

        public IOrderRepository OrderRepository => _orderRepository;

        public INoteRepository NoteRepository => _noteRepository;

        public IDepositRepository DepositRepository => _depositRepository;

        public IPostCategoryRepository PostCategoryRepository => _postCategoryRepository;

        public IHashtagRepository HashtagRepository => _hashtagRepository;

        public IPostRepository PostRepository => _postRepository;

        public IPostHashtagRepository PostHashtagRepository => _postHashtagRepository;

        public IRequestRepository RequestRepository => _requestRepository;
        public IRequestDetailRepository RequestDetailRepository => _requestDetailRepository;
        public ITempRepository TransactionRepository => _transactionRepository;

        public async Task<int> SaveChangeAsync()
        {
            return await _dbContext.SaveChangesAsync();
        }
    }
}
