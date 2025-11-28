using FluentAssertions;
using Microsoft.EntityFrameworkCore;
using rebisco_bugtracker.Api.domain.defects;
using Moq;

namespace rebisco_bugtracker.Tests.defects
{
    public class DefectServiceTest
    {
        private readonly BugTrackerContext _context;
        private readonly DefectService _service;
        private readonly Mock<IFileStorageGateway> _gateway;

        public DefectServiceTest()
        {
            var options = new DbContextOptionsBuilder<BugTrackerContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            _context = new BugTrackerContext(options);
            _gateway = new Mock<IFileStorageGateway>();
            _service = new DefectService(_context, _gateway.Object);
        }

        [Fact]
        public void GetAll_ShouldReturnAllDefects()
        {
            var defect = new Defect
            {
                RaisedByTeam = "QA",
                Description = "Test defect",
                Responsible = "John",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _context.Defect.Add(defect);
            _context.SaveChanges();

            var result = _service.GetAll();

            result.Should().HaveCount(1);
        }

        [Fact]
        public void Get_ShouldReturnDefect_WhenExists()
        {
            var defect = new Defect
            {
                RaisedByTeam = "QA",
                Description = "Issue",
                Responsible = "John",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _context.Defect.Add(defect);
            _context.SaveChanges();

            var result = _service.Get(defect.Id);

            result.Should().NotBeNull();
            result!.Description.Should().Be("Issue");
        }

        [Fact]
        public void Get_ShouldThrow_WhenNotFound()
        {
            Action act = () => _service.Get(999);
            act.Should().Throw<ResponseStatusException>();
        }


        [Fact]
        public void Create_ShouldInsertDefect()
        {
            var defect = new Defect
            {
                RaisedByTeam = "QA",
                Description = "Create test",
                Responsible = "Alex",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            var result = _service.Create(defect);

            result.Id.Should().BeGreaterThan(0);
            _context.Defect.Count().Should().Be(1);
        }

        [Fact]
        public void Update_ShouldModifyDefect()
        {
            var defect = new Defect
            {
                RaisedByTeam = "QA",
                Description = "Original",
                Responsible = "Sam",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _context.Defect.Add(defect);
            _context.SaveChanges();

            defect.Description = "Updated";

            var updated = _service.Update(defect);

            updated.Description.Should().Be("Updated");
        }

        [Fact]
        public void Delete_ShouldReturnTrue_WhenFound()
        {
            var defect = new Defect
            {
                RaisedByTeam = "QA",
                Description = "To delete",
                Responsible = "Nithin",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _context.Defect.Add(defect);
            _context.SaveChanges();

            var result = _service.Delete(defect.Id);

            result.Should().BeTrue();
            _context.Defect.Count().Should().Be(0);
        }

        [Fact]
        public void Delete_ShouldThrow_WhenNotFound()
        {
            Action act = () => _service.Delete(999);
            act.Should().Throw<ResponseStatusException>();
        }

        [Fact]
        public void PartialUpdate_ShouldThrow_WhenNotFound()
        {
            Action act = () => _service.PartialUpdate(999, new Defect());
            act.Should().Throw<ResponseStatusException>();
        }

    
        [Fact]
        public void GetDefectsByMonthAndYear_ShouldThrow_WhenMonthInvalid()
        {
            Action action = () => _service.GetDefectsByMonthAndYear(15, 2025);

            action.Should().Throw<ResponseStatusException>();        
        }

        [Fact(Skip = "Cannot test FromSqlRaw with InMemory database")]
        public void GetDefectsByMonthAndYear_ShouldReturnResults()
        {
            _context.Defect.Add(new Defect
            {
                Description = "Sample",
                CreatedDate = new DateTime(2025, 1, 10)
            });
            _context.SaveChanges();

            var result = _service.GetDefectsByMonthAndYear(1, 2025);

            result.Should().HaveCount(1);
        }




    }
}
