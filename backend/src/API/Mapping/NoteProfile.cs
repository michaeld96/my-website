using AutoMapper;
using Core.Models;
using System;

namespace API.Mapping;

public class NoteProfile : Profile
{
    public NoteProfile()
    {
        // Entity -> DTO (backend to frontend).
        CreateMap<Note, NoteDTO>();
        CreateMap<School, SchoolDTO>();
        CreateMap<Subject, SubjectDTO>();

        // DTO -> Entity (frontend to backend).
        CreateMap<NoteUpdateDTO, Note>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) // Ignore this field.
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.Tags, opt => opt.Ignore())
            .ForMember(dest => dest.Subject, opt => opt.Ignore());
        
        CreateMap<NoteCreateDTO, Note>()
            .ForMember(dest => dest.Id, opt => opt.Ignore()) 
            .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.Now))
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Tags, opt => opt.Ignore())
            .ForMember(dest => dest.Subject, opt => opt.Ignore());

        CreateMap<SchoolDTO, School>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Subjects, opt => opt.Ignore());

        CreateMap<SubjectDTO, Subject>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.School, opt => opt.Ignore()) // We want to ignore any navigational properties.
            .ForMember(dest => dest.Notes, opt => opt.Ignore());

        
    }
}
