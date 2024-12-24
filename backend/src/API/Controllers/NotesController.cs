using Infrastructure.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NotesController : ControllerBase
    {
        private readonly NotesContext _context;
        public NotesController(NotesContext context)
        {
            _context = context;
        }

        // GET /api/notes/schools
        [HttpGet("schools")]
        public async Task<IActionResult> GetSchools()
        {
            var schools = await _context.Notes
                .Select(n => n.School)
                .Distinct()
                .ToListAsync();

            return Ok(schools);
        }
        // GET /api/notes/{school}/subjects
        [HttpGet("{school}/subjects")]
        public async Task<IActionResult> GetSubjects(string school)
        {
            var subjects = await _context.Notes
                .Where(n => n.School == school)
                .Select(n => n.Subject)
                .Distinct()
                .ToListAsync();
            
            return Ok(subjects);
        }
    }
}
