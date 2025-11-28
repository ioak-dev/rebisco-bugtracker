using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Moq;
using rebisco_bugtracker.Api.domain.defects;

namespace rebisco_bugtracker.Tests.defects
{
    public class DefectsControllerTest
    {
        private readonly Mock<IDefectService> _service = new();
        private readonly DefectsController _controller;

        public DefectsControllerTest()
        {
            _controller = new DefectsController(_service.Object);
        }

        [Fact]
        public void List_ShouldReturnAllDefects()
        {
            var defects = new List<Defect>
            {
                new Defect
                {
                    Id = 1,
                    RaisedByTeam = "Team A",
                    Description = "Issue found",
                    Responsible = "John",
                    CreatedDate = DateTime.Now,
                    UpdatedDate = DateTime.Now
                }
            };

            _service.Setup(s => s.GetAll()).Returns(defects);

            var result = _controller.List();

            result.Should().BeEquivalentTo(defects);
        }

        [Fact]
        public void Get_ShouldReturnOk_WhenDefectExists()
        {
            var defect = new Defect
            {
                Id = 1,
                RaisedByTeam = "Team A",
                Description = "Issue",
                Responsible = "John",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _service.Setup(s => s.Get(1)).Returns(defect);

            var result = _controller.Get(1);

            result.Should().BeOfType<OkObjectResult>();
            var okResult = result as OkObjectResult;
            okResult!.Value.Should().Be(defect);
        }

        [Fact]
        public void Create_ShouldReturnCreatedDefect()
        {
            var defect = new Defect
            {
                Id = 1,
                RaisedByTeam = "QA",
                Description = "Create test",
                Responsible = "Nithin",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _service.Setup(s => s.Create(defect)).Returns(defect);

            var result = _controller.Create(defect);

            result.Should().Be(defect);
        }

        [Fact]
        public void Remove_ShouldReturnTrue_WhenSuccess()
        {
            _service.Setup(s => s.Delete(1)).Returns(true);

            var result = _controller.Remove(1);

            result.Should().BeTrue();
        }

        [Fact]
        public void Remove_ShouldReturnFalse_WhenFailed()
        {
            _service.Setup(s => s.Delete(1)).Returns(false);

            var result = _controller.Remove(1);

            result.Should().BeFalse();
        }

        [Fact]
        public void Update_ShouldReturnOk_WhenSuccess()
        {
            var defect = new Defect
            {
                Id = 1,
                RaisedByTeam = "Dev",
                Description = "Updated test",
                Responsible = "Alex",
                CreatedDate = DateTime.Now,
                UpdatedDate = DateTime.Now
            };

            _service.Setup(s => s.PartialUpdate(1, defect)).Returns(defect);

            var result = _controller.Update(1, defect);

            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task UploadFile_ShouldReturnOk_WhenSuccess()
        {
            var files = new List<IFormFile>
            {
                new FormFile(new MemoryStream(new byte[10]), 0, 10, "file", "test.txt")
            };

            _service.Setup(s => s.UploadFileAsync(1, files))
                    .ReturnsAsync(new List<DefectFile>());

            var result = await _controller.UploadFile(1, files);

            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task UploadFile_ShouldReturnBadRequest_WhenNoFile()
        {
            var result = await _controller.UploadFile(1, new List<IFormFile>());

            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task Download_ShouldReturnFile_WhenExists()
        {
            var fileBytes = new byte[] { 1, 2, 3 };
            _service.Setup(s => s.GetFilesByDefectAsync("fileRef"))
                    .ReturnsAsync(fileBytes);

            var result = await _controller.Download("fileRef");

            result.Should().BeOfType<FileContentResult>();
        }

        [Fact]
        public async Task Download_ShouldReturnNotFound_WhenEmpty()
        {
            _service.Setup(s => s.GetFilesByDefectAsync("fileRef"))
                    .ReturnsAsync(Array.Empty<byte>());

            var result = await _controller.Download("fileRef");

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteFile_ShouldReturnNoContent_WhenSuccess()
        {
            _service.Setup(s => s.DeleteFileAsync("fileRef"))
                    .ReturnsAsync(true);

            var result = await _controller.Delete("fileRef");

            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task DeleteFile_ShouldReturnNotFound_WhenFailed()
        {
            _service.Setup(s => s.DeleteFileAsync("fileRef"))
                    .ReturnsAsync(false);

            var result = await _controller.Delete("fileRef");

            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public void GetByMonth_ShouldReturnOk()
        {
            _service.Setup(s => s.GetDefectsByMonthAndYear(1, 2025))
                    .Returns(new List<Defect>());

            var result = _controller.GetByMonth(1, 2025);

            result.Should().BeOfType<OkObjectResult>();
        }

        [Fact]
        public async Task ImportExcel_ShouldReturnBadRequest_WhenNoFile()
        {
            var result = await _controller.ImportExcel(null);

            result.Should().BeOfType<BadRequestObjectResult>();
        }

        [Fact]
        public async Task ImportExcel_ShouldReturnOk_WhenSuccess()
        {
            var file = new FormFile(new MemoryStream(new byte[10]), 0, 10, "file", "test.xlsx");

            _service.Setup(s => s.ReadExcel(file))
                    .ReturnsAsync(new List<DefectImportModel>());
            _service.Setup(s => s.BatchUpsert(It.IsAny<List<DefectImportModel>>()))
                    .Returns(new BatchResult());

            var result = await _controller.ImportExcel(file);

            result.Should().BeOfType<OkObjectResult>();
        }

    }
}
