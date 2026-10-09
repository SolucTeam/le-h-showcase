<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Event recommendations use a thin server function and server-only AI Gateway helpers; event briefs remain transient to avoid storing organizer data.
- Gateway access blocks and anonymous request budgets are durable service-role-only records; fail closed when these safeguards are unavailable.
- Performance galleries reuse the playground media catalog and native inline video controls with responsive sources; only one visible clip plays at once.
