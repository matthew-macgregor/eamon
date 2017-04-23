from django.contrib import admin

# Register your models here.
from .models import Adventure, Author, Room, RoomExit, Artifact, Effect, Monster, Hint, HintAnswer


@admin.register(Adventure)
class AdventureAdmin(admin.ModelAdmin):
    list_display = ('name', 'author_list', 'edx', 'edx_version', 'active', 'tag_list')
    list_filter = ['edx', 'edx_version', 'authors', 'active']
    ordering = ['name']

    def get_queryset(self, request):
        return super(AdventureAdmin, self).get_queryset(request).prefetch_related('tags')

    def author_list(self, obj):
        return ", ".join(o.name for o in obj.authors.all())

    def tag_list(self, obj):
        return ", ".join(o.name for o in obj.tags.all())


@admin.register(Author)
class AuthorAdmin(admin.ModelAdmin):
    list_display = ('__str__',)


class RoomExitInline(admin.TabularInline):
    model = RoomExit


@admin.register(Room)
class RoomAdmin(admin.ModelAdmin):
    list_display = ('adventure', 'room_id', 'name')
    list_display_links = ('room_id', 'name')
    list_filter = ['adventure']
    ordering = ['adventure', 'room_id']

    inlines = [
        RoomExitInline,
    ]


@admin.register(Artifact)
class ArtifactAdmin(admin.ModelAdmin):
    list_display = ('adventure', 'artifact_id', 'name', 'room_id', 'container_id', 'monster_id')
    list_display_links = ('artifact_id', 'name')
    list_filter = ['adventure']
    ordering = ['adventure', 'artifact_id']


@admin.register(Effect)
class EffectAdmin(admin.ModelAdmin):
    list_display = ('adventure', 'effect_id', 'text')
    list_display_links = ('effect_id', 'text')
    list_filter = ['adventure']
    ordering = ['adventure', 'effect_id']


@admin.register(Monster)
class MonsterAdmin(admin.ModelAdmin):
    list_display = ('adventure', 'monster_id', 'name', 'room_id')
    list_display_links = ('name', )
    list_filter = ['adventure']
    ordering = ['adventure_id', 'monster_id']


class HintAnswerInline(admin.TabularInline):
    model = HintAnswer


@admin.register(Hint)
class HintAdmin(admin.ModelAdmin):
    list_display = ('adventure', 'index', 'question')
    list_display_links = ('index', 'question')
    list_filter = ['adventure']
    ordering = ['adventure_id', 'index']

    inlines = [
        HintAnswerInline,
    ]
